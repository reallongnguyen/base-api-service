import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import HttpResponse from 'src/common/models/HttpResponse';
import { PrismaService } from 'src/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from 'nestjs-pino';
import { Cache } from 'cache-manager';
import { AuthContextInfo } from './models/auth-context-info.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('auth: authGuard: missing access token');

      throw HttpResponse.error('common.invalidToken');
    }

    const signature = token.split('.')[2];

    if (!signature) {
      this.logger.warn('auth: authGuard: incorrect token format');

      throw HttpResponse.error('common.invalidToken');
    }

    const authCtxKey = `authCtx_${signature}`;

    try {
      // check if there is the cache data for this token
      const cachedAuthCtx = await this.cacheManager.get(authCtxKey);

      if (cachedAuthCtx) {
        request.authContext = cachedAuthCtx;

        return true;
      }

      this.logger.verbose(
        'auth: authGuard: there is no cached authCtx => verify access token',
      );

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('security.jwtSecret'),
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const authCtx = AuthContextInfo.fromJwtPayload(payload);

      const user = await this.prismaService.user.findUnique({
        where: { authId: payload.sub },
      });

      if (user) {
        authCtx.roles = user.roles;
        authCtx.userId = user.id;
      }

      // save authCtx to the cache if JWT have full information
      if (user) {
        const ttl = authCtx.jwtPayload.exp * 1000 - Date.now();
        await this.cacheManager.set(authCtxKey, authCtx, ttl);
      }

      request.authContext = authCtx;
    } catch (err) {
      this.logger.warn(`auth: authGuard: ${err}`);

      throw HttpResponse.error('common.invalidToken');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

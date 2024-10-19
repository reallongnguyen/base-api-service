import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from 'nestjs-pino';
import { Cache } from 'cache-manager';
import { AuthContextInfo, setUser } from './models/auth-context-info.model';
import { AppError } from '../models/AppError';
import { AuthCtxRepo, AuthUsecase } from './auth.usecase';

@Injectable()
export class JWTGuard implements CanActivate {
  private authUsecase: AuthUsecase;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const authCtxRepo: AuthCtxRepo = {
      getAuthCtxId: (request) => {
        const token = this.extractTokenFromHeader(request);

        if (!token) {
          this.logger.warn('auth: jwtGuard: missing access token');

          throw new AppError('common.invalidToken');
        }

        const signature = token.split('.')[2];

        if (!signature) {
          this.logger.warn('auth: jwtGuard: incorrect token format');

          throw new AppError('common.invalidToken');
        }

        const payload = this.jwtService.decode(token);

        return `${payload.sub}:${signature}`;
      },
      getAuthCtx: async (request) => {
        const token = this.extractTokenFromHeader(request);

        if (!token) {
          this.logger.warn('auth: jwtGuard: missing access token');

          throw new AppError('common.invalidToken');
        }

        const shouldVerifyToken = this.configService.get<boolean>(
          'security.shouldVerifyToken',
          false,
        );

        let payload: any;

        if (!shouldVerifyToken) {
          payload = this.jwtService.decode(token);
        } else {
          payload = await this.jwtService
            .verifyAsync(token, {
              secret: this.configService.get<string>('security.jwtSecret'),
            })
            .catch((err) => {
              this.logger.warn(`auth: jwtGuard: invalid token: ${err.message}`);

              throw new AppError('common.invalidToken');
            });
        }

        let authCtx = AuthContextInfo.fromAuthServiceJwtPayload(payload);

        const user = await this.prismaService.user.findUnique({
          where: { authId: payload.sub },
        });

        if (user) {
          authCtx = setUser(authCtx, user);
        }

        return authCtx;
      },
    };

    this.authUsecase = new AuthUsecase(
      this.logger,
      this.cacheManager,
      authCtxRepo,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.authUsecase.canActivate(request);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

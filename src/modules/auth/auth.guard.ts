import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import HttpResponse from 'src/commons/models/HttpResponse';
import { PrismaService } from 'src/prisma.service';
import AuthContextInfo from './models/auth-context-info.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw HttpResponse.error('common.invalidToken');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('security.jwtSecret'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const authCtx = AuthContextInfo.fromJwtPayload(payload);

      // TODO: get data in cache instead of query to DB
      const user = await this.prismaService.user.findUnique({
        where: { authId: payload.sub },
      });

      if (user) {
        authCtx.roles = user.roles;
        authCtx.userId = user.id;
      }

      request.authContext = authCtx;
    } catch {
      throw HttpResponse.error('common.invalidToken');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

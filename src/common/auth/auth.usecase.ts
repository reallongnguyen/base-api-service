import { Logger } from 'nestjs-pino';
import { Cache } from 'cache-manager';
import { AppError } from 'src/common/models';
import { AuthContextInfo, shouldCache } from './models/auth-context-info.model';

export interface AuthCtxRepo {
  getAuthCtxId: (request: any) => string;
  getAuthCtx: (request: any) => Promise<AuthContextInfo>;
}

export class AuthUsecase {
  constructor(
    private logger: Logger,
    private cacheManager: Cache,
    private authCtxRepo: AuthCtxRepo,
  ) {}

  async canActivate(request: any): Promise<boolean> {
    const authCtxId = this.authCtxRepo.getAuthCtxId(request);

    const authCtxKey = `authCtx:${authCtxId}`;

    try {
      // check if there is the cache data for this token
      const cachedAuthCtx = await this.cacheManager.get(authCtxKey);

      if (cachedAuthCtx) {
        request.authContext = cachedAuthCtx;

        return true;
      }

      this.logger.verbose(
        'auth: authUsecase: there is no cached authCtx => verify token',
      );

      const authCtx = await this.authCtxRepo.getAuthCtx(request);

      if (shouldCache(authCtx)) {
        const ttl = authCtx.expireAt
          ? authCtx.expireAt * 1000 - Date.now()
          : 15 * 60 * 1000;

        if (ttl > 0) {
          await this.cacheManager.set(authCtxKey, authCtx, ttl);
        }
      }

      request.authContext = authCtx;

      return true;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      this.logger.error(`auth: authUsecase: ${err.message}`);

      throw new AppError('common.serverError');
    }
  }
}

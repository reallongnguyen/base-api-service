import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisStore } from 'cache-manager-redis-store';
import { LoggerModule } from './logger/logger.module';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from '../modules/health/health.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (service: ConfigService) => [
        {
          ttl: service.get<number>('security.throttle.ttl'),
          limit: service.get<number>('security.throttle.limit'),
        },
      ],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (service: ConfigService) => {
        return {
          store: redisStore as any,
          url: service.get<string>('redis.url'),
        };
      },
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    HealthModule,
  ],
})
export class CommonModule {}

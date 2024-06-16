import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from 'src/commons/config/config.module';
import { LoggerModule } from 'src/commons/logger/logger.module';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from 'src/modules/auth/auth.module';
import { HealthModule } from 'src/modules/health/health.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (service: ConfigService) => [
        {
          ttl: service.get<number>('security.throttle.ttl'),
          limit: service.get<number>('security.throttle.limit'),
        },
      ],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [AppConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (service: ConfigService) => {
        return {
          store: 'redis',
          url: service.get<string>('redis.url'),
        };
      },
    }),
    EventEmitterModule.forRoot(),
    // Register business modules here
    AuthModule,
    UserModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

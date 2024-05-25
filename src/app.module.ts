import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from 'src/commons/config/config.module';
import { LoggerModule } from 'src/commons/logger/logger.module';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (service: ConfigService) => [
        {
          ttl: service.get<number>('throttle.ttl'),
          limit: service.get<number>('throttle.limit'),
        },
      ],
    }),
    // Register business modules here
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

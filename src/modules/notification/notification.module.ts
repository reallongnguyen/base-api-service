import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationSubscriber } from './notification.subscriber';
import { DeepLinkHelper } from './deeplink.helper';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationSubscriber, DeepLinkHelper],
})
export class NotificationModule {}

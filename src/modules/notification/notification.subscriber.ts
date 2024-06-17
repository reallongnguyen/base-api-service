import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'nestjs-pino';
import {
  NotificationCreatedEvent,
  ProfileUpdatedEvent,
} from 'src/common/models';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationSubscriber {
  constructor(
    private logger: Logger,
    private notificationService: NotificationService,
  ) {}

  // demo notification
  @OnEvent('profile.updated')
  handleProfileUpdatedEvent(payload: ProfileUpdatedEvent) {
    this.logger.debug(
      `notification: subscriber: profile.updated: ${JSON.stringify(payload)}`,
    );

    this.notificationService.upsertUpdateProfileNotification(payload);
  }

  @OnEvent('notification.created')
  handleNotificationCreatedEvent(payload: NotificationCreatedEvent) {
    this.logger.debug(
      `notification: subscriber: notification.created: ${JSON.stringify(payload)}`,
    );

    // send notice via mqtt
    // send push
  }
}

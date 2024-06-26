import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from 'nestjs-pino';
import {
  NotificationCreatedEvent,
  ProfileUpdatedEvent,
} from 'src/common/models';
import { NotificationProducerService } from '../usecases/notification-producer.service';

@Injectable()
export class EventSubscriber {
  constructor(
    private logger: Logger,
    private eventService: NotificationProducerService,
  ) {}

  // demo notification
  @OnEvent('profile.updated')
  handleProfileUpdatedEvent(payload: ProfileUpdatedEvent) {
    this.logger.debug(
      `notification: event.subscriber: profile.updated: ${JSON.stringify(payload)}`,
    );

    this.eventService.handleProfileUpdated(payload);
  }

  @OnEvent('notification.created')
  handleNotificationCreatedEvent(payload: NotificationCreatedEvent) {
    this.logger.debug(
      `notification: event.subscriber: notification.created: ${JSON.stringify(payload)}`,
    );

    // send notice via mqtt
    // send push
  }

  @OnEvent('notification.updated')
  handleNotificationUpdatedEvent(payload: NotificationCreatedEvent) {
    this.logger.debug(
      `notification: event.subscriber: notification.updated: ${JSON.stringify(payload)}`,
    );

    // send notice via mqtt
    // send push
  }
}

import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppResult, ProfileUpdatedEvent } from 'src/common/models';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import * as Mustache from 'mustache';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from './models/notification.model';
import { NotificationType } from './models/notification-type.enum';
import { DeepLinkHelper } from './deeplink.helper';
import { notificationTemplate } from './models/notification.template';

@Injectable()
export class NotificationService {
  constructor(
    private deepLinkHelper: DeepLinkHelper,
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
    private logger: Logger,
  ) {}

  // TODO: make sure processing notification sequential if key is same
  // use queue
  async upsertUpdateProfileNotification(
    payload: ProfileUpdatedEvent,
  ): Promise<AppResult<Notification, string>> {
    const key = NotificationService.buildNotificationKey(
      NotificationType.updt,
      payload.id,
      payload.id,
    );

    const notificationCreatedInput: Prisma.NotificationCreateInput = {
      key,
      userId: payload.id,
      type: NotificationType.updt,
      subjects: [
        {
          id: payload.id,
          name: payload.name,
          type: 'user',
          image: payload.avatar,
        },
      ],
      subjectCount: 1,
      text: '',
      decorators: [],
      link: this.deepLinkHelper.getProfilePageDeepLink(payload.id),
    };

    try {
      notificationCreatedInput.text = Mustache.render(
        notificationTemplate.vi.updateProfile,
        notificationCreatedInput,
      );

      this.logger.verbose(
        `notification: service: upsertUpdateProfileNotification: text: ${notificationCreatedInput.text}`,
      );

      const notification = await this.prismaService.notification.upsert({
        where: { key },
        create: notificationCreatedInput,
        update: {
          text: notificationCreatedInput.text,
          decorators: notificationCreatedInput.decorators,
          link: notificationCreatedInput.link,
          readAt: null,
        },
      });

      this.eventEmitter.emit('notification.created', notification);

      return { data: notification as Notification };
    } catch (err) {
      this.logger.error(
        `notification: service: upsertUpdateProfileNotification: ${err.message}`,
      );

      return { err: 'common.serverError' };
    }
  }

  static buildNotificationKey(
    type: NotificationType,
    diObjectId: string,
    targetUserId: string,
  ): string {
    return `${type}:${diObjectId}:${targetUserId}`;
  }
}

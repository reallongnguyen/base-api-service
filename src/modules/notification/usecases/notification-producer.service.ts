import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppResult, ProfileUpdatedEvent } from 'src/common/models';
import { PrismaService } from 'src/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '../entities/notification-type.enum';
import { NotificationCreateInput } from '../controllers/dto/notification.dto';

@Injectable()
export class NotificationProducerService {
  constructor(
    private logger: Logger,
    private prismaService: PrismaService,
    @InjectQueue('notification') private notiQueue: Queue,
  ) {}
  async handleProfileUpdated(
    payload: ProfileUpdatedEvent,
  ): Promise<AppResult<string, string>> {
    const notification = new NotificationCreateInput();
    notification.key = `${NotificationType.updateProfile}:${payload.id}:${payload.id}`;
    notification.type = NotificationType.updateProfile;
    notification.userId = payload.id;
    notification.subjects = [
      {
        id: payload.id,
        type: 'user',
        name: payload.name,
        image: payload.avatar,
      },
    ];
    notification.subjectCount = 1;
    notification.link = `/users/${payload.id}/profile`;

    try {
      await this.notiQueue.add(notification, {
        attempts: 3,
        timeout: 60000,
        backoff: {
          type: 'exponential',
          delay: 32000,
        },
      });

      return { data: '' };
    } catch (err) {
      this.logger.error(
        `notification: event.service: handleProfileUpdated: ${err.message}`,
      );

      return { err: 'serverError' };
    }
  }
}

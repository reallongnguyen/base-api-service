import { Prisma } from '@prisma/client';
import { NotificationType } from '../../entities/notification-type.enum';

export class NotificationCreateInput
  implements
    Pick<
      Prisma.NotificationCreateInput,
      | 'key'
      | 'type'
      | 'userId'
      | 'subjects'
      | 'subjectCount'
      | 'diObject'
      | 'inObject'
      | 'prObject'
      | 'link'
    >
{
  key: string;
  type: NotificationType;
  userId: string;
  subjects?: PrismaJson.NotificationObjectType[];
  subjectCount: number;
  diObject?: PrismaJson.NotificationObjectType;
  inObject?: PrismaJson.NotificationObjectType;
  prObject?: PrismaJson.NotificationObjectType;
  link?: string;
}

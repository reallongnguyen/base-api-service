import { Notification as NotificationIf } from '@prisma/client';
import { NotificationType } from './notification-type.enum';

export class NotificationObject implements PrismaJson.NotificationObjectType {
  id: string;
  name: string;
  type: string;
  image?: string;
}

export class NotificationDecorator
  implements PrismaJson.NotificationDecoratorType
{
  type: string;
  offset: string;
  length: string;
}

export class Notification implements NotificationIf {
  id: string;
  key: string;
  type: NotificationType;
  userId: string;
  subjects: NotificationObject[];
  subjectCount: number;
  diObject: NotificationObject;
  inObject: NotificationObject;
  prObject: NotificationObject;
  text: string;
  decorators: NotificationDecorator[];
  link: string;
  createdAt: Date;
  updatedAt: Date;
  readAt: Date;
}

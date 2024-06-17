export interface ProfileUpdatedEvent {
  id: string;
  name: string;
  avatar?: string;
}

export interface NotificationCreatedEvent {
  id: string;
  type: string;
  userId: string;
  text: string;
  decorators: PrismaJson.NotificationDecoratorType;
}

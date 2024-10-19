export {};

declare global {
  namespace PrismaJson {
    type NotificationObjectType = {
      id: string;
      name: string;
      type: string;
      image?: string;
    };
    type NotificationDecoratorType = {
      offset: number;
      length: number;
      class: string;
      type?: string;
      link?: string;
    };
  }
}

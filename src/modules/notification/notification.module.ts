import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationController } from './controllers/notification.controller';
import { NotificationConsumerService } from './usecases/notification-consumer.service';
import { EventSubscriber } from './controllers/event.subscriber';
import { NotificationProcessor } from './controllers/notification.processor';
import { NotificationProducerService } from './usecases/notification-producer.service';
import { RedlockMutex } from './repositories/redlock.mutex';
import { NotificationService } from './usecases/notification.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'notification' })],
  controllers: [NotificationController],
  providers: [
    EventSubscriber,
    NotificationConsumerService,
    NotificationService,
    NotificationProcessor,
    NotificationProducerService,
    RedlockMutex,
  ],
})
export class NotificationModule {}

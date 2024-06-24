import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationController } from './controllers/notification.controller';
import { NotificationConsumerService } from './usecases/notification-consumer.service';
import { EventSubscriber } from './controllers/event.subscriber';
import { NotificationProcessor } from './controllers/notification.processor';
import { NotificationProducerService } from './usecases/notification-producer.service';
import { RedlockMutex } from './repositories/redlock.mutex';

@Module({
  imports: [BullModule.registerQueue({ name: 'notification' })],
  controllers: [NotificationController],
  providers: [
    EventSubscriber,
    NotificationProducerService,
    NotificationConsumerService,
    NotificationProcessor,
    RedlockMutex,
  ],
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController } from './controllers/notification.controller';
import { NotificationConsumerService } from './usecases/notification-consumer.service';
import { EventSubscriber } from './controllers/event.subscriber';
import { NotificationProcessor } from './controllers/notification.processor';
import { NotificationProducerService } from './usecases/notification-producer.service';
import { RedlockMutex } from './repositories/redlock.mutex';
import { NotificationService } from './usecases/notification.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'notification' }),
    ClientsModule.register([
      {
        name: 'notification_mqtt_client',
        transport: Transport.MQTT,
        options: { url: process.env.MQTT_URL },
      },
    ]),
  ],
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

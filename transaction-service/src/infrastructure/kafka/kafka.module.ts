import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';
import { CqrsModule } from '@nestjs/cqrs';
import { IEVENT_SUBSCRIBER_PORT } from 'src/domain/ports/event-suscriber.port';
import { EventSubscriberService } from 'src/application/services/event-subscriber.service';

@Module({
  imports: [CqrsModule],
  providers: [
    KafkaConsumerService,
    EventSubscriberService,
    {
      provide: IEVENT_SUBSCRIBER_PORT,
      useExisting: EventSubscriberService,
    },
  ],
  exports: [KafkaConsumerService, EventSubscriberService],
})
export class KafkaModule {}

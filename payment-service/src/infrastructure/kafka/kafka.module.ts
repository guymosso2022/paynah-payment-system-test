import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventFactory } from '../factories/event.factory';
import { Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { UuidV4Generator } from '../uuid/uuid-v4-generator.service';
import { KafkaEventPublisher } from './services/kafka-producer.service';
import { KafkaConsumerService } from './services/kafka-consumer.service';
import { EventSubscriberService } from 'src/application/services/event-subscriber.service';
import { IEVENT_SUBSCRIBER_PORT } from 'src/domain/ports/event-subscriber.port';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'payment-service',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [
    EventFactory,
    KafkaEventPublisher,
    {
      provide: 'KAFKA_BROKER',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
      inject: [ConfigService],
    },
    {
      provide: IUNIQUE_ID_GENERATOR_PORT,
      useClass: UuidV4Generator,
    },
    KafkaConsumerService,
    EventSubscriberService,
    {
      provide: IEVENT_SUBSCRIBER_PORT,
      useExisting: EventSubscriberService,
    },
  ],
  exports: [
    KafkaEventPublisher,
    ClientsModule,
    EventFactory,
    EventSubscriberService,
  ],
})
export class KafkaModule {}

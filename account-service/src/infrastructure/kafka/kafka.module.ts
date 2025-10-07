import { Module } from '@nestjs/common';
import { KafkaProducerService } from './services/kafka-producer.service';
import { EventFactory } from '../factories/event.factory';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { UuidV4Generator } from '../uuid/uuid-v4-generator';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from './services/kafka-consumer.service';
import { EventSubscriberService } from 'src/application/services/event-subscriber.service';
import { IEVENT_SUBSCRIBER_PORT } from 'src/domain/ports/event-subcriber.port';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
            clientId: process.env.KAFKA_CLIENT_ID || 'account-service',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [
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
    EventFactory,
    KafkaProducerService,
    KafkaConsumerService,
    EventSubscriberService,
    {
      provide: IEVENT_SUBSCRIBER_PORT,
      useExisting: EventSubscriberService,
    },
  ],
  exports: [
    ClientsModule,
    KafkaProducerService,
    EventSubscriberService,
    EventFactory,
  ],
})
export class kafkaModule {}

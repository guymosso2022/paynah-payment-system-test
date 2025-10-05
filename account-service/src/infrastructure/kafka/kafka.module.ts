import { Module } from '@nestjs/common';
import { KafkaProducerService } from './services/kafka-producer.service';
import { EventFactory } from '../factories/event.factory';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { UuidV4Generator } from '../uuid/uuid-v4-generator';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // ✅ Token pour injection
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'account-service',
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
  ],
  exports: [ClientsModule, KafkaProducerService, EventFactory],
})
export class kafkaModule {}

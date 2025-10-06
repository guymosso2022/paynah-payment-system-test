import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IPAYMENT_REPOSITORY_PORT } from 'src/domain/ports/payment.port';
import { PrismaPaymentRepository } from './repositories/prisma-payment.repository';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { UuidV4Generator } from './uuid/uuid-v4-generator.service';
import { CqrsModule } from '@nestjs/cqrs';
import { IEVENT_PUBLISHER_PORT } from 'src/domain/ports/event-publisher.port';
import { KafkaEventPublisher } from './kafka/services/kafka-producer.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [PrismaModule, CqrsModule, KafkaModule],
  providers: [
    {
      provide: IPAYMENT_REPOSITORY_PORT,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: IUNIQUE_ID_GENERATOR_PORT,
      useClass: UuidV4Generator,
    },

    {
      provide: IEVENT_PUBLISHER_PORT,
      useClass: KafkaEventPublisher,
    },
  ],
  exports: [
    IPAYMENT_REPOSITORY_PORT,
    IUNIQUE_ID_GENERATOR_PORT,
    IEVENT_PUBLISHER_PORT,
  ],
})
export class InfrastructureModule {}

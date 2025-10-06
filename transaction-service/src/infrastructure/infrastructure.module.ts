import { Module } from '@nestjs/common';
import { ITRANSACTION_REPOSITORY_PORT } from 'src/domain/ports/transaction.port';
import { PrismaTransactionRepository } from './repositories/prisma-transaction.repository';
import { PrismaModule } from './prisma/prisma.module';
import { IEVENT_SUBSCRIBER_PORT } from 'src/domain/ports/event-suscriber.port';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaModule } from './kafka/kafka.module';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator-port';
import { UuidV4Generator } from './uuid/uuid-v4-generator.service';
import { EventSubscriberService } from 'src/application/services/event-subscriber.service';

@Module({
  imports: [PrismaModule, KafkaModule, CqrsModule],
  providers: [
    {
      provide: ITRANSACTION_REPOSITORY_PORT,
      useClass: PrismaTransactionRepository,
    },

    {
      provide: IUNIQUE_ID_GENERATOR_PORT,
      useClass: UuidV4Generator,
    },
    {
      provide: IEVENT_SUBSCRIBER_PORT,
      useExisting: EventSubscriberService,
    },
  ],
  exports: [
    ITRANSACTION_REPOSITORY_PORT,
    IUNIQUE_ID_GENERATOR_PORT,
    IEVENT_SUBSCRIBER_PORT,
  ],
})
export class InfrastructureModule {}

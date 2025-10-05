import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { UuidV4Generator } from './uuid/uuid-v4-generator';
import { IACCOUNT_REPOSITORY_PORT } from 'src/domain/ports/account.port';
import { PrismaAccountRepository } from './repositories/prisma-account.repository';
import { IMONEY_CALCULATOR_PORT } from 'src/domain/ports/money-calculator';
import { MoneyCalculator } from '../domain/services/money-calculator.service';
import { kafkaModule } from './kafka/kafka.module';
import { IEVENT_PUBLISHER_PORT } from 'src/domain/ports/event-publisher.port';
import { KafkaProducerService } from './kafka/services/kafka-producer.service';

@Module({
  imports: [PrismaModule, kafkaModule],
  providers: [
    {
      provide: IUNIQUE_ID_GENERATOR_PORT,
      useClass: UuidV4Generator,
    },
    {
      provide: IACCOUNT_REPOSITORY_PORT,
      useClass: PrismaAccountRepository,
    },

    { provide: IMONEY_CALCULATOR_PORT, useClass: MoneyCalculator },
    {
      provide: IEVENT_PUBLISHER_PORT,
      useClass: KafkaProducerService,
    },
  ],
  exports: [
    IUNIQUE_ID_GENERATOR_PORT,
    IACCOUNT_REPOSITORY_PORT,
    IMONEY_CALCULATOR_PORT,
    IEVENT_PUBLISHER_PORT,
  ],
})
export class InfrastructureModule {}

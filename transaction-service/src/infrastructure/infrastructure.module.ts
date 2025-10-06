import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { ITRANSACTION_REPOSITORY_PORT } from 'src/domain/ports/transaction.port';
import { PrismaTransactionRepository } from './repositories/prisma-transaction.repository';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [
    {
      provide: ITRANSACTION_REPOSITORY_PORT,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [],
})
export class InfrastructureModule {}

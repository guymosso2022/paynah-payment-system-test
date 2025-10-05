import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { UuidV4Generator } from './uuid/uuid-v4-generator';
import { IACCOUNT_REPOSITORY_PORT } from 'src/domain/ports/account.port';
import { PrismaAccountRepository } from './repositories/prisma-account.repository';
import { IMONEY_CALCULATOR_PORT } from 'src/domain/ports/money-calculator';
import { MoneyCalculator } from '../domain/services/money-calculator.service';

@Module({
  imports: [PrismaModule],
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
  ],
  exports: [
    IUNIQUE_ID_GENERATOR_PORT,
    IACCOUNT_REPOSITORY_PORT,
    IMONEY_CALCULATOR_PORT,
  ],
})
export class InfrastructureModule {}

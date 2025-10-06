import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IPAYMENT_REPOSITORY_PORT } from 'src/domain/ports/payment.port';
import { PrismaPaymentRepository } from './repositories/prisma-payment.repository';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { UuidV4Generator } from './uuid/uuid-v4-generator.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [
    {
      provide: IPAYMENT_REPOSITORY_PORT,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: IUNIQUE_ID_GENERATOR_PORT,
      useClass: UuidV4Generator,
    },
  ],
  exports: [IPAYMENT_REPOSITORY_PORT, IUNIQUE_ID_GENERATOR_PORT],
})
export class InfrastructureModule {}

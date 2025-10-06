import { Injectable } from '@nestjs/common';
import { Payment } from 'src/domain/entities/payment.entity';
import { IPaymentRepositoryPort } from 'src/domain/ports/payment.port';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentId } from 'src/domain/value-objects/payment-id.vo';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(payment: Payment): Promise<Payment> {
    const record = await this.prisma.payment.upsert({
      where: { id: payment.getId().value },
      update: {
        status: payment.getStatus(),
        updatedAt: new Date(),
      },
      create: {
        id: payment.getId().value,
        sourceAccountId: payment.getSourceAccountId().getValue(),
        targetAccountId: payment.getTargetAccountId().getValue(),
        amount: payment.getAmount().value,
        currency: payment.getAmount().currency,
        status: payment.getStatus(),
        createdAt: payment.getCreatedAt(),
        updatedAt: payment.getUpdatedAt(),
      },
    });

    // return Payment.reconstitute({
    //   id: payment.getId(),
    //   sourceAccountId: AccountId.create(record.sourceAccountId),
    //   targetAccountId: AccountId.create(record.targetAccountId),
    //   amount: Money.from(record.amount),
    //   status: record.status as PaymentStatus,
    //   createdAt: record.createdAt ?? new Date(),
    //   updatedAt: record.updatedAt ?? new Date(),
    // });
    return payment;
  }

  findOne(id: PaymentId): Promise<Payment | null> {
    throw new Error('Method not implemented.');
  }
}

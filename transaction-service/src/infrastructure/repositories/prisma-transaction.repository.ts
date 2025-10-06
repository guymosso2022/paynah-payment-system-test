import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionType } from 'src/domain/enums/transaction-type.enum';
import { TransactionStatus } from 'src/domain/enums/transaction.enum-status';
import { ITransactionRepositoryPort } from 'src/domain/ports/transaction.port';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async save(transaction: Transaction): Promise<Transaction> {
    const record = await this.prisma.transaction.upsert({
      where: { id: transaction.getId().value },
      update: {
        amount: transaction.getAmount().value,
        type: transaction.getType(),
        status: transaction.getStatus(),
        accountId: transaction.getAccountId()?.value,
        paymentId: transaction.getPaymentId()?.value,
        description: transaction.getDescription(),
        updatedAt: new Date(),
      },
      create: {
        id: transaction.getId().value,

        amount: transaction.getAmount().value,
        type: transaction.getType(),
        status: transaction.getStatus(),
        accountId: transaction.getAccountId()?.value,
        paymentId: transaction.getPaymentId()?.value,
        currency: transaction.getAmount().currency,
        description: transaction.getDescription(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return transaction;
  }
  findById(accountId: AccountId): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }
}

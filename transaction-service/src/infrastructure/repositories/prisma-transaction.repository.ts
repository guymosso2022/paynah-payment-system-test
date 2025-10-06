import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepositoryPort } from 'src/domain/ports/transaction.port';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
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

  async findById(
    accountId: AccountId,
    page = 1,
    limit = 20,
  ): Promise<{
    data: {
      id: string;
      amount: number;
      currency: string;
      type: string;
      status: string;
      accountId: string | null;
      paymentId: string | null;
      description: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
    }[];
    meta: {
      firstPage: number;
      total: number;
      lastPage: number;
      currentPage: number;
      itemsPerPage: number;
    };
  }> {
    if (!accountId) {
      throw new Error('AccountId is required');
    }

    const safePage = page && page > 0 ? page : 1;
    const safeLimit = limit && limit > 0 ? limit : 20;
    const skip = (safePage - 1) * safeLimit;

    const [records, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { accountId: accountId.getValue() },
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({
        where: { accountId: accountId.getValue() },
      }),
    ]);

    const meta = {
      firstPage: 1,
      total: total,
      lastPage: Math.ceil(total / safeLimit),
      currentPage: safePage,
      itemsPerPage: safeLimit,
    };

    const transactions = records.map((record) => ({
      ...record,
      createdAt: record.createdAt ? new Date(record.createdAt) : null,
      updatedAt: record.updatedAt ? new Date(record.updatedAt) : null,
    }));

    return { data: transactions, meta };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepositoryPort } from 'src/domain/ports/transaction.port';
import { AccountId } from 'src/domain/value-objects/account-id.vo';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: Transaction): Promise<Transaction> {
    await this.prisma.transaction.upsert({
      where: { id: transaction.getId().value },
      update: {
        amount: transaction.getAmount().value,
        type: transaction.getType(),
        status: transaction.getStatus(),
        accountId: transaction.getAccountId()?.value,
        paymentId: transaction.getPaymentId()?.value,
        targetAccountId: transaction.getTargetAccountId()?.value,
        currency: transaction.getAmount().currency,
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
        targetAccountId: transaction.getTargetAccountId()?.value,
        description: transaction.getDescription(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return transaction;
  }

  async findByAccountId(
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

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 20;
    const skip = (safePage - 1) * safeLimit;

    const whereClause = {
      OR: [
        { accountId: accountId.getValue() },
        { targetAccountId: accountId.getValue() },
      ],
    };

    const [records, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: whereClause,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where: whereClause }),
    ]);

    const meta = {
      firstPage: 1,
      total,
      lastPage: Math.ceil(total / safeLimit),
      currentPage: safePage,
      itemsPerPage: safeLimit,
    };

    const transactions = records.map((record) => {
      let direction: 'OUTGOING' | 'INCOMING';

      if (record.type === 'DEBIT') {
        direction =
          record.accountId === accountId.getValue() ? 'OUTGOING' : 'INCOMING';
      } else if (record.type === 'CREDIT') {
        direction =
          record.accountId === accountId.getValue() ? 'INCOMING' : 'OUTGOING';
      } else {
        direction =
          record.accountId === accountId.getValue() ? 'OUTGOING' : 'INCOMING';
      }

      return {
        ...record,
        direction,
        createdAt: record.createdAt ? new Date(record.createdAt) : null,
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null,
      };
    });

    return { data: transactions, meta };
  }
}

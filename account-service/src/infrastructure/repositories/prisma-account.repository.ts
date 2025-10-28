import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAccountRepositoryPort } from 'src/domain/ports/account.port';
import { Account } from 'src/domain/entities/account.entity';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { MoneyCalculator } from '../../domain/services/money-calculator.service';
@Injectable()
export class PrismaAccountRepository implements IAccountRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(account: Account): Promise<Account> {
    await this.prisma.account.upsert({
      where: { id: account.id.value },
      update: {
        balance: account.getBalance().value,
        currency: account.getBalance().getCurrency(),
        updatedAt: account.updatedAt,
      },
      create: {
        id: account.getId().value,
        balance: account.getBalance().value,
        currency: account.getBalance().getCurrency(),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    });
    return account;
  }

  async findOneById(accountId: AccountId): Promise<Account | null> {
    const record = await this.prisma.account.findUnique({
      where: { id: accountId.getValue() },
    });

    if (!record) return null;
    const account = Account.create(
      accountId,
      Money.from(record.balance, record.currency ?? 'XOF'),
      new MoneyCalculator(),
    );
    account.createdAt = record.createdAt ?? new Date();
    account.updatedAt = record.updatedAt ?? new Date();

    return account;
  }

  async decrementBalance(accountId: string, amount: number): Promise<void> {
    const updatedFrom = await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });
  }

  async incrementBalance(accountId: string, amount: number): Promise<void> {
    const updatedFrom = await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });
  }
}

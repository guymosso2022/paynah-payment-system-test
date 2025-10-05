import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAccountRepositoryPort } from 'src/domain/ports/account.port';
import { Account } from 'src/domain/entities/account.entity';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { MoneyCalculator } from '../../domain/services/money-calculator.service';
import {
  IMONEY_CALCULATOR_PORT,
  IMoneyCalculator,
} from 'src/domain/ports/money-calculator';
@Injectable()
export class PrismaAccountRepository implements IAccountRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    // @Inject('MoneyCalculator') private readonly calculator: IMoneyCalculator,
    @Inject(IMONEY_CALCULATOR_PORT)
    private readonly calculator: IMoneyCalculator,
  ) {}
  async save(account: Account): Promise<Account> {
    await this.prisma.account.upsert({
      where: { id: account.id.value },
      update: {
        balance: account.getBalance().value,
        currency: account.getBalance().getCurrency(),
        updatedAt: account.updatedAt,
      },
      create: {
        balance: account.getBalance().value,
        currency: account.getBalance().getCurrency(),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    });
    return account;
  }
  findById(accountId: AccountId): Promise<Account | null> {
    throw new Error('Method not implemented.');
  }
  credit(accountId: AccountId, amount: number): Promise<Account> {
    throw new Error('Method not implemented.');
  }
  debit(accountId: AccountId, amount: number): Promise<Account> {
    throw new Error('Method not implemented.');
  }
}

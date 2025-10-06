import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepositoryPort } from 'src/domain/ports/transaction.port';
import { AccountId } from 'src/domain/value-objects/account-id.vo';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepositoryPort {
  constructor() {}
  save(account: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
  findById(accountId: AccountId): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }
}

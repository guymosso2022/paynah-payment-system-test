import { Transaction } from '../entities/transaction.entity';
import { AccountId } from '../value-objects/account-id.vo';

export const ITRANSACTION_REPOSITORY_PORT = Symbol(
  'ITransactionRepositoryPort',
);
export interface ITransactionRepositoryPort {
  save(account: Transaction): Promise<Transaction>;
  findById(accountId: AccountId): Promise<Transaction[]>;
}

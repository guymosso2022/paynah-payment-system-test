import { Transaction } from '../entities/transaction.entity';
import { AccountId } from '../value-objects/account-id.vo';

export const IACCOUNT_REPOSITORY_PORT = Symbol('IAccountRepositoryPort');
export interface IAccountRepositoryPort {
  save(account: Transaction): Promise<Transaction>;
  findById(accountId: AccountId): Promise<Transaction[]>;
}

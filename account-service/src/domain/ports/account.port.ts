import { Account } from '../entities/account.entity';
import { AccountId } from '../value-objects/account-id.vo';

export const IACCOUNT_REPOSITORY_PORT = Symbol('IAccountRepositoryPort');
export interface IAccountRepositoryPort {
  save(account: Account): Promise<Account>;
  findById(accountId: AccountId): Promise<Account | null>;
  credit(accountId: AccountId, amount: number): Promise<Account>;
  debit(accountId: AccountId, amount: number): Promise<Account>;
}

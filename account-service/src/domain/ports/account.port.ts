import { Account } from '../entities/account.entity';
import { AccountId } from '../value-objects/account-id.vo';

export const IACCOUNT_REPOSITORY_PORT = Symbol('IAccountRepositoryPort');
export interface IAccountRepositoryPort {
  save(account: Account): Promise<Account>;
  findOneById(accountId: AccountId): Promise<Account | null>;
  decrementBalance(accountId: string, amount: number): Promise<void>;
  incrementBalance(accountId: string, amount: number): Promise<void>;
}

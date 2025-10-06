import { Transaction } from '../entities/transaction.entity';
import { AccountId } from '../value-objects/account-id.vo';

export const ITRANSACTION_REPOSITORY_PORT = Symbol(
  'ITransactionRepositoryPort',
);
export interface ITransactionRepositoryPort {
  save(transaction: Transaction): Promise<Transaction>;
  findById(
    accountId: AccountId,
    skip?: number,
    limit?: number,
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
  }>;
}

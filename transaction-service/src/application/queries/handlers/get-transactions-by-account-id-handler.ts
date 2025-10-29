import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionsByAccountIdQuery } from '../get-transaction-by-account-id.query';
import { Inject } from '@nestjs/common';
import {
  ITRANSACTION_REPOSITORY_PORT,
  ITransactionRepositoryPort,
} from 'src/domain/ports/transaction.port';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { AccountId } from 'src/domain/value-objects/account-id.vo';

@QueryHandler(GetTransactionsByAccountIdQuery)
export class GetTransactionsByAccountIdHandler
  implements IQueryHandler<GetTransactionsByAccountIdQuery>
{
  constructor(
    @Inject(ITRANSACTION_REPOSITORY_PORT)
    private readonly transactionRepository: ITransactionRepositoryPort,
  ) {}

  async execute(query: GetTransactionsByAccountIdQuery): Promise<{
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
    const { accountId, page, limit } = query;
    const skip = (page - 1) * limit;
    const accountIdVO = AccountId.create(accountId);

    return this.transactionRepository.findByAccountId(accountIdVO, skip, limit);
  }
}

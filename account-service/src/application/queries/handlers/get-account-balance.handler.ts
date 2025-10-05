import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountBalanceQuery } from '../get-account-balance.query';
import { Inject } from '@nestjs/common';
import {
  IACCOUNT_REPOSITORY_PORT,
  IAccountRepositoryPort,
} from 'src/domain/ports/account.port';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { AccountNotFoundApplicationException } from 'src/application/exceptions/account-not-found.exception';

@QueryHandler(GetAccountBalanceQuery)
export class GetAccountBalanceHandler
  implements IQueryHandler<GetAccountBalanceQuery>
{
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
  ) {}

  async execute(
    query: GetAccountBalanceQuery,
  ): Promise<{ balance: number; currency: string }> {
    const accountId = AccountId.create(query.accountId);
    const account = await this.accountRepository.findOneById(accountId);

    if (!account) {
      throw new AccountNotFoundApplicationException(
        `Account ${query.accountId} not found`,
      );
    }

    return {
      balance: account.getBalance().value,
      currency: account.getBalance().getCurrency(),
    };
  }
}

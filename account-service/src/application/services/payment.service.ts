import { Inject, Injectable } from '@nestjs/common';
import {
  IACCOUNT_REPOSITORY_PORT,
  IAccountRepositoryPort,
} from 'src/domain/ports/account.port';
import { AccountId } from 'src/domain/value-objects/account-id.vo';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
  ) {}

  async transfer(
    sourceAccountId: string,
    targetAccountId: string,
    amount: number,
  ): Promise<
    | 'TRANSFER_COMPLETED'
    | 'ACCOUNT_NOT_FOUND'
    | 'DEST_ACCOUNT_NOT_FOUND'
    | 'INSUFFICIENT_FUNDS'
  > {
    const sourceAccountIdVo = new AccountId(sourceAccountId);
    const targetAccountIdVo = new AccountId(targetAccountId);
    const sourceAccount =
      await this.accountRepository.findOneById(sourceAccountIdVo);
    if (!sourceAccount) return 'ACCOUNT_NOT_FOUND';

    const targetAccount =
      await this.accountRepository.findOneById(targetAccountIdVo);
    if (!targetAccount) return 'DEST_ACCOUNT_NOT_FOUND';

    if (sourceAccount.getBalance().value < amount) return 'INSUFFICIENT_FUNDS';

    await this.accountRepository.decrementBalance(sourceAccountId, amount);
    await this.accountRepository.incrementBalance(targetAccountId, amount);

    return 'TRANSFER_COMPLETED';
  }
}

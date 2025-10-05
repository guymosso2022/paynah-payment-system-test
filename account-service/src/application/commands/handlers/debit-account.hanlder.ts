import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebitAccountCommand } from '../debit-account.command';
import {
  IACCOUNT_REPOSITORY_PORT,
  IAccountRepositoryPort,
} from 'src/domain/ports/account.port';
import { Inject } from '@nestjs/common';
import { Account } from 'src/domain/entities/account.entity';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { AccountNotFoundApplicationException } from 'src/application/exceptions/account-not-found.exception';
import { Money } from 'src/domain/value-objects/money.vo';

@CommandHandler(DebitAccountCommand)
export class DebitAccountHandler
  implements ICommandHandler<DebitAccountCommand>
{
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
  ) {}
  async execute(command: DebitAccountCommand): Promise<Account> {
    const account = await this.accountRepository.findOneById(
      AccountId.create(command.accountId),
    );
    if (!account) {
      throw new AccountNotFoundApplicationException(
        `Account ${command.accountId} not found`,
      ); // ou une exception custom
    }
    account.debit(Money.from(command.amount, command.currency));
    const updatedAccount = await this.accountRepository.save(account);
    return updatedAccount;
  }
}

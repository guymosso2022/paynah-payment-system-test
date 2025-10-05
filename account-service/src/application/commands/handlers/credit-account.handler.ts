import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreditAccountCommand } from '../credit-account.command';
import { Inject } from '@nestjs/common';
import {
  IACCOUNT_REPOSITORY_PORT,
  IAccountRepositoryPort,
} from 'src/domain/ports/account.port';
import { Account } from 'src/domain/entities/account.entity';
import { Money } from 'src/domain/value-objects/money.vo';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { AccountNotFoundException } from 'src/application/exceptions/account-not-found.exception';

@CommandHandler(CreditAccountCommand)
export class CreditAccountHandler
  implements ICommandHandler<CreditAccountCommand>
{
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
  ) {}
  async execute(command: CreditAccountCommand): Promise<Account> {
    const account = await this.accountRepository.findOneById(
      AccountId.create(command.accountId),
    );
    if (!account) {
      throw new AccountNotFoundException('Account not found'); // ou une exception custom
    }
    account.credit(Money.from(command.amount, command.currency));
    const updatedAccount = await this.accountRepository.save(account);
    return updatedAccount;
  }
}

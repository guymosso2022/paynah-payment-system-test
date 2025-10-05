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
import { AccountNotFoundApplicationException } from 'src/application/exceptions/account-not-found.exception';
import { AccountEventPublisherService } from 'src/application/services/account-event-publisher.service';
import { AccountCreditedEvent } from 'src/domain/events/account-credited.event';

@CommandHandler(CreditAccountCommand)
export class CreditAccountHandler
  implements ICommandHandler<CreditAccountCommand>
{
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
    private readonly accountEventPublisherService: AccountEventPublisherService,
  ) {}
  async execute(command: CreditAccountCommand): Promise<Account> {
    const account = await this.accountRepository.findOneById(
      AccountId.create(command.accountId),
    );
    if (!account) {
      throw new AccountNotFoundApplicationException(
        `Account ${command.accountId} not found`,
      );
    }
    account.credit(Money.from(command.amount, command.currency));
    await this.accountEventPublisherService.publishDomainEvents(
      account,
      AccountCreditedEvent,
    );
    const updatedAccount = await this.accountRepository.save(account);
    return updatedAccount;
  }
}

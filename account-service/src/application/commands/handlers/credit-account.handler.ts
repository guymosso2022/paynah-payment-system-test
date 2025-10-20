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
import { AccountCreditedEvent } from 'src/domain/events/account-credited.event';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';
import { AccountNotFoundApplicationException } from 'src/application/exceptions/account-not-found.exception';

@CommandHandler(CreditAccountCommand)
export class CreditAccountHandler
  implements ICommandHandler<CreditAccountCommand>
{
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async execute(command: CreditAccountCommand): Promise<Account | void> {
    const account = await this.accountRepository.findOneById(
      AccountId.create(command.accountId),
    );

    if (!account) {
      const failedEvent = new AccountCreditedEvent(
        command.accountId,
        0,
        'CREDIT',
        'FAILED_NOT_FOUND',
        command.currency,
      );
      await this.eventPublisher.publish(failedEvent);
      throw new AccountNotFoundApplicationException('Account not found');
    }

    account.credit(Money.from(command.amount, command.currency));

    const successEvent = new AccountCreditedEvent(
      account.getId().value,
      command.amount,
      'CREDIT',
      'SUCCESS',
      command.currency,
    );
    await this.eventPublisher.publish(successEvent);

    return this.accountRepository.save(account);
  }
}

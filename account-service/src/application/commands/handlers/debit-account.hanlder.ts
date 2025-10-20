import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebitAccountCommand } from '../debit-account.command';
import {
  IACCOUNT_REPOSITORY_PORT,
  IAccountRepositoryPort,
} from 'src/domain/ports/account.port';
import { Inject } from '@nestjs/common';
import { Account } from 'src/domain/entities/account.entity';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { AccountDebitedEvent } from 'src/domain/events/account-debited.event';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';

@CommandHandler(DebitAccountCommand)
export class DebitAccountHandler
  implements ICommandHandler<DebitAccountCommand>
{
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async execute(command: DebitAccountCommand): Promise<Account | void> {
    const account = await this.accountRepository.findOneById(
      AccountId.create(command.accountId),
    );

    if (!account) {
      const failedEvent = new AccountDebitedEvent(
        command.accountId,
        0,
        'DEBIT',
        'FAILED_NOT_FOUND',
        command.currency,
      );
      await this.eventPublisher.publish(failedEvent);
      return;
    }
    const amount = Money.from(command.amount, command.currency);
    if (account.getBalance().lessThan(amount)) {
      const failedEvent = new AccountDebitedEvent(
        account.getId().value,
        command.amount,
        'DEBIT',
        'FAILED_INSUFFICIENT_FUNDS',
        command.currency,
      );
      await this.eventPublisher.publish(failedEvent);
      return;
    }
    account.debit(Money.from(command.amount, command.currency));

    const successEvent = new AccountDebitedEvent(
      account.getId().value,
      command.amount,
      'DEBIT',
      'SUCCESS',
      command.currency,
    );

    await this.eventPublisher.publish(successEvent);

    return this.accountRepository.save(account);
  }
}

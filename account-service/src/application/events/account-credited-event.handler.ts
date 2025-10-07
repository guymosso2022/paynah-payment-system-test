import { Inject } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { AccountCreditedEvent } from 'src/domain/events/account-credited.event';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';

export class AccountCreditedEventHandler
  implements IEventHandler<AccountCreditedEvent>
{
  constructor(
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
  ) {}
  async handle(event: AccountCreditedEvent) {
    await this.eventPublisher.publish(event);
  }
}

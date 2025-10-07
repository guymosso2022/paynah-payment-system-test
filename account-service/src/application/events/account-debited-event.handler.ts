import { Inject } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { AccountDebitedEvent } from 'src/domain/events/account-debited.event';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';

export class AccountDebitedEventHandler
  implements IEventHandler<AccountDebitedEvent>
{
  constructor(
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
  ) {}
  async handle(event: AccountDebitedEvent) {
    await this.eventPublisher.publish(event);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'src/domain/entities/account.entity';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';

@Injectable()
export class AccountEventPublisherService {
  constructor(
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async publishDomainEvents(
    account: Account,
    eventType?: new (...args: any[]) => any,
  ) {
    const events = account.getUncommittedEvents();
    const filtered = eventType
      ? events.filter((e) => e instanceof eventType)
      : events;

    for (const event of filtered) {
      await this.eventPublisher.publish(event);
    }
  }
}

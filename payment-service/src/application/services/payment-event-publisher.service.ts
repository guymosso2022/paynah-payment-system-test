import { Inject, Injectable } from '@nestjs/common';
import { Payment } from 'src/domain/entities/payment.entity';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';

@Injectable()
export class PaymentEventPublisherService {
  constructor(
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
  ) {}

  async publishDomainEvents(
    payment: Payment,
    eventType?: new (...args: any[]) => any,
  ) {
    const events = payment.getUncommittedEvents();
    const filtered = eventType
      ? events.filter((e) => e instanceof eventType)
      : events;

    for (const event of filtered) {
      await this.eventPublisher.publish(event);
    }
  }
}

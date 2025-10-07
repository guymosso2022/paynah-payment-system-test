import { Inject } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { PaymentCreatedEvent } from 'src/domain/events/payment-created.event';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';

export class PaymentCreatedEventHandler
  implements IEventHandler<PaymentCreatedEvent>
{
  constructor(
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
  ) {}
  async handle(event: PaymentCreatedEvent) {
    await this.eventPublisher.publish(event);
  }
}

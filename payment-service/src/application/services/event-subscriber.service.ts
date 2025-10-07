import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IEventSubscriberPort } from 'src/domain/ports/event-subscriber.port';
import { UpdatePaymentHandler } from '../commands/handlers/update-payment.handler';
import { UpdatePaymentCommand } from '../commands/update-payment.command';

@Injectable()
export class EventSubscriberService implements IEventSubscriberPort {
  constructor(private readonly commandBus: CommandBus) {}

  async consumeUpdatePayment(paymentId: string, status: string): Promise<void> {
    await this.commandBus.execute(new UpdatePaymentCommand(paymentId, status));
  }
}

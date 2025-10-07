import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IEventSubscriberPort } from 'src/domain/ports/event-subcriber.port';
import { CreatePaymentCommand } from '../commands/create-payment.command';

@Injectable()
export class EventSubscriberService implements IEventSubscriberPort {
  constructor(private readonly commandBus: CommandBus) {}

  async consumePaymentCreated(
    paymentId: string,
    sourceAccountId: string,
    targetAccountId: string,
    amount: number,
    currency: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new CreatePaymentCommand(
        paymentId,
        amount,
        sourceAccountId,
        targetAccountId,
        currency,
      ),
    );
  }
}

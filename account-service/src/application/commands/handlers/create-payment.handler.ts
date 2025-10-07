import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../create-payment.command';
import {
  IACCOUNT_REPOSITORY_PORT,
  IAccountRepositoryPort,
} from 'src/domain/ports/account.port';
import { Inject } from '@nestjs/common';
import {
  IEVENT_PUBLISHER_PORT,
  IEventPublisherPort,
} from 'src/domain/ports/event-publisher.port';
import { PaymentCreatedEvent } from 'src/domain/events/payment-created.event';
import { PaymentService } from 'src/application/services/payment.service';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(
    @Inject(IEVENT_PUBLISHER_PORT)
    private readonly eventPublisher: IEventPublisherPort,
    private readonly paymentService: PaymentService,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<void> {
    const status = await this.paymentService.transfer(
      command.sourceAccountId,
      command.targetAccountId,
      command.amount,
    );

    await this.publishEvent(command, status);
  }

  private async publishEvent(command: CreatePaymentCommand, status: string) {
    const event = new PaymentCreatedEvent(
      command.sourceAccountId,
      command.targetAccountId,
      command.amount,
      command.currency,
      status,
      command.paymentId,
    );
    await this.eventPublisher.publish(event);
  }
}

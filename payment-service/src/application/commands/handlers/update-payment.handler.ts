import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePaymentCommand } from '../update-payment.command';
import { Inject } from '@nestjs/common';
import {
  IPAYMENT_REPOSITORY_PORT,
  IPaymentRepositoryPort,
} from 'src/domain/ports/payment.port';
import { PaymentId } from 'src/domain/value-objects/payment-id.vo';
import { InternalPaymentStatus } from 'src/domain/enums/internal-payment-status';

@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentCommand>
{
  constructor(
    @Inject(IPAYMENT_REPOSITORY_PORT)
    private readonly paymentRepository: IPaymentRepositoryPort,
  ) {}

  async execute(command: UpdatePaymentCommand): Promise<void> {
    const paymentIdIVO = PaymentId.create(command.paymentId);
    const payment = await this.paymentRepository.findOne(paymentIdIVO);
    if (!payment) return;

    payment.updateStatus(command.status as InternalPaymentStatus);

    await this.paymentRepository.save(payment);
  }
}

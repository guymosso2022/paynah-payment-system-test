import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../create-payment.command';
import { Inject } from '@nestjs/common';
import {
  IPAYMENT_REPOSITORY_PORT,
  IPaymentRepositoryPort,
} from 'src/domain/ports/payment.port';
import {
  IUNIQUE_ID_GENERATOR_PORT,
  IUniqueIdGeneratorPort,
} from 'src/domain/ports/unique-id-generator.port';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Payment } from 'src/domain/entities/payment.entity';
import { Money } from 'src/domain/value-objects/money.vo';
import { PaymentId } from 'src/domain/value-objects/payment-id.vo';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(
    @Inject(IPAYMENT_REPOSITORY_PORT)
    private readonly paymentRepository: IPaymentRepositoryPort,
    @Inject(IUNIQUE_ID_GENERATOR_PORT)
    private readonly idGenerator: IUniqueIdGeneratorPort,
  ) {}
  async execute(command: CreatePaymentCommand): Promise<Payment> {
    const id = this.idGenerator.generate();
    const sourceAccountIdVO = AccountId.create(command.sourceAccountId);
    const targetAccountIdVO = AccountId.create(command.targetAccountId);
    const payment = Payment.create(
      PaymentId.create(id),
      sourceAccountIdVO,
      targetAccountIdVO,
      Money.from(command.amount, command.currency),
    );
    const paymentPersisted = await this.paymentRepository.save(payment);
    return paymentPersisted;
  }
}

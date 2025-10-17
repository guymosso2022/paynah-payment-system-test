import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../create-transaction.command';
import { Inject } from '@nestjs/common';
import {
  ITRANSACTION_REPOSITORY_PORT,
  ITransactionRepositoryPort,
} from 'src/domain/ports/transaction.port';
import {
  IUNIQUE_ID_GENERATOR_PORT,
  IUniqueIdGeneratorPort,
} from 'src/domain/ports/unique-id-generator-port';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionId } from 'src/domain/value-objects/transaction-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { TransactionStatus } from 'src/domain/enums/transaction.enum-status';
import { TransactionType } from 'src/domain/enums/transaction-type.enum';
import { PaymentId } from 'src/domain/value-objects/payment-id.vo';
import { AccountId } from 'src/domain/value-objects/account-id.vo';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    @Inject(ITRANSACTION_REPOSITORY_PORT)
    private readonly transactionRepository: ITransactionRepositoryPort,
    @Inject(IUNIQUE_ID_GENERATOR_PORT)
    private readonly idGenerator: IUniqueIdGeneratorPort,
  ) {}
  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const id = this.idGenerator.generate();
    const transaction = Transaction.create(
      TransactionId.create(id),
      command.type,
      command.status as TransactionStatus,
      Money.from(command.amount, command.currency),
      command.accountId ? AccountId.create(command.accountId) : undefined,
      command.paymentId ? PaymentId.create(command.paymentId) : undefined,
      command.targetAccountId
        ? AccountId.create(command.targetAccountId)
        : undefined,
    );
    return await this.transactionRepository.save(transaction);
  }
}

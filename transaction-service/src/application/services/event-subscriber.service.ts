import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IEventSubscriberPort } from 'src/domain/ports/event-suscriber.port';
import { CreateTransactionCommand } from '../commands/create-transaction.command';
import { TransactionType } from 'src/domain/enums/transaction-type.enum';
import { TransactionStatus } from 'src/domain/enums/transaction.enum-status';

@Injectable()
export class EventSubscriberService implements IEventSubscriberPort {
  constructor(private readonly commandBus: CommandBus) {}

  async consumeAccountCredited(
    accountId: string,
    amount: number,
    type: string,
    status: TransactionStatus,
  ): Promise<void> {
    console.log('accountId!!!!!', accountId, amount, type);
    // Créer une transaction de type CREDIT via le CommandBus
    await this.commandBus.execute(
      new CreateTransactionCommand(
        type as TransactionType,
        status,
        amount,
        accountId,
      ),
    );
  }

  async consumeAccountDebited(
    accountId: string,
    amount: number,
    type: TransactionType,
    status: TransactionStatus,
  ): Promise<void> {
    // Créer une transaction de type DEBIT via le CommandBus
    await this.commandBus.execute(
      new CreateTransactionCommand(
        type as TransactionType,
        status,
        amount,
        accountId,
      ),
    );
  }
}

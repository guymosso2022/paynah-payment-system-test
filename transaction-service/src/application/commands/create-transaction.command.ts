import { ICommand } from '@nestjs/cqrs';
import { TransactionType } from 'src/domain/enums/transaction-type.enum';
import { TransactionStatus } from 'src/domain/enums/transaction.enum-status';

export class CreateTransactionCommand implements ICommand {
  constructor(
    public readonly type: TransactionType,
    public readonly status: TransactionStatus,
    public readonly amount: number,
    public readonly currency: string,
    public readonly accountId?: string,
    public readonly paymentId?: string,
    public readonly targetAccountId?: string,
  ) {}
}

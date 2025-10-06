import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionStatus } from '../enums/transaction.enum-status';
import { AccountId } from '../value-objects/account-id.vo';
import { Money } from '../value-objects/money.vo';
import { PaymentId } from '../value-objects/payment-id.vo';
import { TransactionId } from '../value-objects/transaction-id.vo';

export class Transaction {
  getCreatedAt() {
    throw new Error('Method not implemented.');
  }
  getUpdatedAt() {
    throw new Error('Method not implemented.');
  }
  static reconstitute(arg0: {
    id: any;
    amount: Money;
    type: TransactionType;
    status: TransactionStatus;
    accountId: any;
    paymentId: any;
    description: any;
    createdAt: any;
    updatedAt: any;
  }): Transaction | PromiseLike<Transaction> {
    throw new Error('Method not implemented.');
  }
  private constructor(
    public readonly id: TransactionId,
    private type: TransactionType,
    private status: TransactionStatus,
    private amount: Money,
    private accountId?: AccountId,
    private paymentId?: PaymentId,
    private description?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  static create(
    id: TransactionId,
    type: TransactionType,
    status: TransactionStatus,
    amount: Money,
    accountId?: AccountId,
    paymentId?: PaymentId,
    description?: string,
  ): Transaction {
    return new Transaction(
      id,
      type,
      status,
      amount,
      accountId,
      paymentId,
      description,
      new Date(),
      new Date(),
    );
  }
  getAmount(): Money {
    return this.amount;
  }

  // getCurrency(): string {
  //   return this.currency;
  // }

  getId(): TransactionId {
    return this.id;
  }

  getAccountId(): AccountId | undefined {
    return this.accountId;
  }

  getPaymentId(): PaymentId | undefined {
    return this.paymentId;
  }

  getType(): TransactionType {
    return this.type;
  }

  getStatus(): TransactionStatus {
    return this.status;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  toJSON() {
    return {
      id: this.id.value,
      type: this.type,
      status: this.status,
      accountId: this.accountId,
      paymentId: this.paymentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

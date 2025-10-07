import { AggregateRoot } from '@nestjs/cqrs';
import { PaymentStatus } from '../enums/payment-status.enum';
import { AccountId } from '../value-objects/account-id.vo';
import { Money } from '../value-objects/money.vo';
import { InvalidAmountException } from '../exceptions/invalid-amount.exception';
import { SameAccountException } from '../exceptions/same-account.exception';
import { PaymentId } from '../value-objects/payment-id.vo';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { InternalPaymentStatus } from '../enums/internal-payment-status';

export class Payment extends AggregateRoot {
  private constructor(
    private readonly id: PaymentId,
    private readonly sourceAccountId: AccountId,
    private readonly targetAccountId: AccountId,
    private readonly amount: Money,
    private status: PaymentStatus,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {
    super();
  }

  static create(
    id: PaymentId,
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    amount: Money,
  ): Payment {
    if (amount.isNegative() || amount.isZero()) {
      throw new InvalidAmountException();
    }

    if (sourceAccountId.equals(targetAccountId)) {
      throw new SameAccountException(
        `The source account (${sourceAccountId.getValue()}) and the target account (${targetAccountId.getValue()}) must be different.`,
      );
    }
    const payment = new Payment(
      id,
      sourceAccountId,
      targetAccountId,
      amount,
      'PENDING' as PaymentStatus,
    );
    return payment;
  }

  static reconstitute(props: {
    id: PaymentId;
    sourceAccountId: AccountId;
    targetAccountId: AccountId;
    amount: Money;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Payment {
    return new Payment(
      props.id,
      props.sourceAccountId,
      props.targetAccountId,
      props.amount,
      props.status,
      props.createdAt,
      props.updatedAt,
    );
  }

  getId(): PaymentId {
    return this.id;
  }

  getSourceAccountId(): AccountId {
    return this.sourceAccountId;
  }

  getTargetAccountId(): AccountId {
    return this.targetAccountId;
  }

  getAmount(): Money {
    return this.amount;
  }

  getCurrency(): string {
    return this.amount.currency;
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // updateStatus(newStatus: PaymentStatus): void {
  //   const validStatuses = Object.values(PaymentStatus);

  //   if (!validStatuses.includes(newStatus)) {
  //     throw new Error(`Invalid payment status: ${newStatus}`);
  //   }

  //   this.status = newStatus;
  // }

  // updateStatus(newStatus: PaymentStatus): void {
  //   // Définir les statuts valides
  //   const validStatuses = Object.values(PaymentStatus);
  //   if (!validStatuses.includes(newStatus)) {
  //     throw new Error(`Invalid payment status: ${newStatus}`);
  //   }

  //   switch (newStatus) {
  //     case 'TRANSFER_COMPLETED':
  //       this.status = 'SUCCESS' as PaymentStatus;
  //       break;
  //     case 'ACCOUNT_NOT_FOUND':
  //     case 'DEST_ACCOUNT_NOT_FOUND':
  //     case 'INSUFFICIENT_FUNDS':
  //       this.status = 'FAILED' as PaymentStatus;
  //       break;
  //     default:
  //       this.status = newStatus; // si tu veux garder d'autres statuts tels quels
  //       break;
  //   }
  // }

  updateStatus(newStatus: InternalPaymentStatus): void {
    const mapping: Record<InternalPaymentStatus, PaymentStatus> = {
      TRANSFER_COMPLETED: PaymentStatus.SUCCESS,
      ACCOUNT_NOT_FOUND: PaymentStatus.FAILED,
      DEST_ACCOUNT_NOT_FOUND: PaymentStatus.FAILED,
      INSUFFICIENT_FUNDS: PaymentStatus.FAILED,
    };

    this.status = mapping[newStatus];
  }
}

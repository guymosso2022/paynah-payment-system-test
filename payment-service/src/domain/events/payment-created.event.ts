import { AccountId } from '../value-objects/account-id.vo';
import { PaymentId } from '../value-objects/payment-id.vo';

export class PaymentCreatedEvent {
  constructor(
    public readonly paymentId: PaymentId,
    public readonly sourceAccountId: AccountId,
    public readonly targetAccountId: AccountId,
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}

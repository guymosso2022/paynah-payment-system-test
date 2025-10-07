import { AccountId } from '../value-objects/account-id.vo';
import { PaymentId } from '../value-objects/payment-id.vo';

export class PaymentCreatedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly sourceAccountId: string,
    public readonly targetAccountId: string,
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}

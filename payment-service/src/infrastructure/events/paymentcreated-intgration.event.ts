import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { PaymentId } from 'src/domain/value-objects/payment-id.vo';

export class PaymentCreatedIntegrationEvent {
  constructor(
    public readonly eventId: string,
    public readonly paymentId: PaymentId,
    public readonly sourceAccountId: AccountId,
    public readonly targetAccountId: AccountId,
    public readonly amount: number,
    public readonly currency: string,
    public readonly occurredOn: Date,
  ) {}
}

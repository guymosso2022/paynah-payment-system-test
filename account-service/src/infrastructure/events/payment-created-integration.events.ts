export class PaymentCreatedIntegrationEvent {
  constructor(
    public readonly eventId: string,
    public readonly sourceAccountId: string,
    public readonly targetAccountId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: string,
    public readonly paymentId: string,
    public readonly occurredOn: Date,
  ) {}
}

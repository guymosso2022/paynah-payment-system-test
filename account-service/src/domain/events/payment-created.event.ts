export class PaymentCreatedEvent {
  constructor(
    public readonly sourceAccountId: string,
    public readonly targetAccountId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly status: string,
    public readonly paymentId: string,
  ) {}
}

export class AccountCreditedIntegrationEvent {
  constructor(
    public readonly eventId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly type: string,
    public readonly status: string,
    public readonly occurredOn: Date,
  ) {}
}

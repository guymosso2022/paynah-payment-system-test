export class AccountCreditedEvent {
  constructor(
    public readonly accountId: string,
    public readonly balance: number,
  ) {}
}

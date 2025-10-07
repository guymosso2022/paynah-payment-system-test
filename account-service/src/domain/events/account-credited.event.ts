export class AccountCreditedEvent {
  constructor(
    public readonly accountId: string,
    public readonly balance: number,
    public readonly type: string,
    public readonly status: string,
  ) {}
}

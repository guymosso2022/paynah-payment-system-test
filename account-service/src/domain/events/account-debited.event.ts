export class AccountDebitedEvent {
  constructor(
    public readonly accountId: string,
    public readonly balance: number,
    public readonly type: string,
    public readonly status: string,
    public readonly currency: string,
  ) {}
}

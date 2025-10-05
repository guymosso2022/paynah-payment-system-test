export class AccountDebitedEvent {
  constructor(
    public readonly accountId: string,
    public readonly balance: number,
  ) {}
}

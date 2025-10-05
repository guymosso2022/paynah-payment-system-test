import { ICommand } from '@nestjs/cqrs';

export class CreditAccountCommand implements ICommand {
  constructor(
    public readonly amount: number,
    public readonly currency: string,
    public readonly accountId: string,
  ) {}
}

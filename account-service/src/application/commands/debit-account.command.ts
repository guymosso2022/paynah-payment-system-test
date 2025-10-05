import { ICommand } from '@nestjs/cqrs';

export class DebitAccountCommand implements ICommand {
  constructor(
    public readonly amount: number,
    public readonly currency: string,
    public readonly accountId: string,
  ) {}
}

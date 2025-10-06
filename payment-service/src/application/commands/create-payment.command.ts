import { ICommand } from '@nestjs/cqrs';

export class CreatePaymentCommand implements ICommand {
  constructor(
    public readonly amount: number,
    public readonly sourceAccountId: string,
    public readonly targetAccountId: string,
    public readonly currency: string,
  ) {}
}

import { ICommand } from '@nestjs/cqrs';

export class CreateAccountCommand implements ICommand {
  constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}

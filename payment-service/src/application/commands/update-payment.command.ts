import { ICommand } from '@nestjs/cqrs';

export class UpdatePaymentCommand {
  constructor(
    public readonly paymentId: string,
    public readonly status: string,
  ) {}
}

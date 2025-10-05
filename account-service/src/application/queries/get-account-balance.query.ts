import { IQuery } from '@nestjs/cqrs';

export class GetAccountBalanceQuery implements IQuery {
  constructor(public readonly accountId: string) {}
}

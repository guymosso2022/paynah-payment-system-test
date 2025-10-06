import { IQuery } from '@nestjs/cqrs';

export class GetTransactionsByAccountIdQuery implements IQuery {
  constructor(
    public readonly accountId: string, // valeur primitive depuis DTO ou route
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

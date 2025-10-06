import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetTransactionsByAccountIdQuery } from 'src/application/queries/get-transaction-by-account-id.query';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { PaginationDto } from '../dtos/get-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Get('accounts/:accountId')
  async findByAccount(
    @Param('accountId') accountId: string,
    @Query() pagination: PaginationDto,
  ) {
    const page = Number(pagination.page ?? 1);
    const limit = Number(pagination.limit ?? 20);

    const accountIdVO = AccountId.create(accountId);

    return this.queryBus.execute(
      new GetTransactionsByAccountIdQuery(accountId, page, limit),
    );
  }
}

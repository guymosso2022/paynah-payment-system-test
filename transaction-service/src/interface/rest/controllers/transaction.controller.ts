import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetTransactionsByAccountIdQuery } from 'src/application/queries/get-transaction-by-account-id.query';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { PaginationDto } from '../dtos/get-transaction.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('accounts/:accountId')
  @ApiParam({
    name: 'accountId',
    description: 'UUID of the account',
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 20 })
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

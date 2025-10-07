import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { CreateAccountCommand } from 'src/application/commands/create-account.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreditAccountCommand } from 'src/application/commands/credit-account.command';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { CreditAccountDto } from '../dtos/credit-account.dto';
import { DebitAccountCommand } from 'src/application/commands/debit-account.command';
import { DebitAccountDto } from '../dtos/debit-accont.dto';
import { GetAccountBalanceQuery } from 'src/application/queries/get-account-balance.query';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Create a new account' })
  @Post()
  async create(
    @Body()
    createAccountDto: CreateAccountDto,
  ) {
    const command = new CreateAccountCommand(
      createAccountDto.amount,
      createAccountDto.currency,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Credit an account' })
  @Post('credits')
  async createAccountCredit(@Body() creditAccountDto: CreditAccountDto) {
    const command = new CreditAccountCommand(
      creditAccountDto.amount,
      creditAccountDto.currency,
      creditAccountDto.accountId,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Debit an account' })
  @Post('debits')
  async createAccountDebit(@Body() debitAccountDto: DebitAccountDto) {
    const command = new DebitAccountCommand(
      debitAccountDto.amount,
      debitAccountDto.currency,
      debitAccountDto.accountId,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Get account balance by ID' })
  @Get(':id/balances')
  async getBalance(@Param('id') id: string) {
    return this.queryBus.execute(new GetAccountBalanceQuery(id));
  }
}

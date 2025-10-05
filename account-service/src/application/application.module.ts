import { Module } from '@nestjs/common';
import { CreateAccountHandler } from './commands/handlers/create-account.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/insfracture.module';
import { CreditAccountHandler } from './commands/handlers/credit-account.handler';
import { DebitAccountHandler } from './commands/handlers/debit-account.hanlder';
import { GetAccountBalanceQuery } from './queries/get-account-balance.query';
import { GetAccountBalanceHandler } from './queries/handlers/get-account-balance.handler';

export const CommandHandlers = [
  CreateAccountHandler,
  CreditAccountHandler,
  DebitAccountHandler,
];

export const QueryHandlers = [GetAccountBalanceHandler];
export const EventHandlers = [];
export const Sagas = [];
@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [...CommandHandlers, ...QueryHandlers],
})
export class ApplicationModule {}

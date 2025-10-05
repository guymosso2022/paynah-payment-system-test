import { Module } from '@nestjs/common';
import { CreateAccountHandler } from './commands/handlers/create-account.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/insfracture.module';
import { CreditAccountHandler } from './commands/handlers/credit-account.handler';
import { DebitAccountHandler } from './commands/handlers/debit-account.hanlder';
import { GetAccountBalanceHandler } from './queries/handlers/get-account-balance.handler';
import { AccountEventPublisherService } from './services/account-event-publisher.service';

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
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    AccountEventPublisherService,
  ],
  exports: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    AccountEventPublisherService,
  ],
})
export class ApplicationModule {}

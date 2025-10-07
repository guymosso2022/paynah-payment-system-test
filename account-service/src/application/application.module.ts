import { Module } from '@nestjs/common';
import { CreateAccountHandler } from './commands/handlers/create-account.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/insfrastructure.module';
import { CreditAccountHandler } from './commands/handlers/credit-account.handler';
import { DebitAccountHandler } from './commands/handlers/debit-account.hanlder';
import { GetAccountBalanceHandler } from './queries/handlers/get-account-balance.handler';

import { CreatePaymentHandler } from './commands/handlers/create-payment.handler';
import { PaymentService } from './services/payment.service';
import { PaymentCreateEventHandler } from './events/payment-created-event.handler';
import { AccountCreditedEventHandler } from './events/account-credited-event.handler';
import { AccountDebitedEventHandler } from './events/account-debited-event.handler';

export const CommandHandlers = [
  CreateAccountHandler,
  CreditAccountHandler,
  DebitAccountHandler,
  CreatePaymentHandler,
];

export const QueryHandlers = [GetAccountBalanceHandler];
export const EventHandlers = [
  PaymentCreateEventHandler,
  AccountCreditedEventHandler,
  AccountDebitedEventHandler,
];
export const Sagas = [];
@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,

    PaymentService,
  ],
  exports: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class ApplicationModule {}

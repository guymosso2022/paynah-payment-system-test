import { Module } from '@nestjs/common';
import { CreateAccountHandler } from './commands/handlers/create-account.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/insfracture.module';
import { CreditAccountHandler } from './commands/handlers/credit-account.handler';
import { DebitAccountHandler } from './commands/handlers/debit-account.hanlder';

export const CommandHandlers = [
  CreateAccountHandler,
  CreditAccountHandler,
  DebitAccountHandler,
];
export const EventHandlers = [];
export const Sagas = [];
@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...CommandHandlers],
  exports: [...CommandHandlers],
})
export class ApplicationModule {}

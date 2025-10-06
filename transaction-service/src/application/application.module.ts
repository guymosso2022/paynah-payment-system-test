import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CreateTransactionHandler } from './commands/handlers/create-transaction.handler';
import { GetTransactionsByAccountIdHandler } from './queries/handlers/get-transactions-by-account-id-handler';

export const CommandHandlers = [
  CreateTransactionHandler,
  GetTransactionsByAccountIdHandler,
];

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...CommandHandlers],
  exports: [...CommandHandlers, CqrsModule],
})
export class ApplicationModule {}

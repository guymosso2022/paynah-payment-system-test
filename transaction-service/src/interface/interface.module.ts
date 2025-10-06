import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from 'src/application/application.module';
import { TransactionController } from './rest/controllers/transaction.controller';

@Module({
  imports: [ApplicationModule, CqrsModule],
  controllers: [TransactionController],
  providers: [],
  exports: [],
})
export class InterfaceModule {}

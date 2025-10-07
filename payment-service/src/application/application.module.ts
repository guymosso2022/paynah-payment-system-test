import { Module } from '@nestjs/common';
import { CreatePaymentHandler } from './commands/handlers/create-payment.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { PaymentCreatedEventHandler } from './events/payment-created-event.handler';

export const CommandHandlers = [CreatePaymentHandler];

export const QueryHandlers = [];

export const EventHandlers = [PaymentCreatedEventHandler];
@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...CommandHandlers],
  exports: [...CommandHandlers],
})
export class ApplicationModule {}

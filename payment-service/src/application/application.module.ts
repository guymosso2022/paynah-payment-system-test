import { Module } from '@nestjs/common';
import { CreatePaymentHandler } from './commands/handlers/create-payment.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { PaymentEventPublisherService } from './services/payment-event-publisher.service';

export const CommandHandlers = [CreatePaymentHandler];

export const QueryHandlers = [];
@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...CommandHandlers, PaymentEventPublisherService],
  exports: [...CommandHandlers, PaymentEventPublisherService],
})
export class ApplicationModule {}

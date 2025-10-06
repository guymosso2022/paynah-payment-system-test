import { Module } from '@nestjs/common';
import { PaymentController } from './rest/controllers/payment.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from 'src/application/application.module';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [PaymentController],
  providers: [],
  exports: [],
})
export class InterfaceModule {}

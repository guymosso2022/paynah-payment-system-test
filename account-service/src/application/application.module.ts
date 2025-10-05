import { Module } from '@nestjs/common';
import { CreateAccountHandler } from './commands/handlers/create-account.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/insfracture.module';

export const CommandHandlers = [CreateAccountHandler];
export const EventHandlers = [];
export const Sagas = [];
@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...CommandHandlers],
  exports: [...CommandHandlers],
})
export class ApplicationModule {}

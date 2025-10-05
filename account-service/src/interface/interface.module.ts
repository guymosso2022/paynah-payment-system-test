import { Module } from '@nestjs/common';
import { AccountController } from './rest/controllers/account.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from 'src/application/application.module';

@Module({
  imports: [CqrsModule, ApplicationModule],
  controllers: [AccountController],
  providers: [],
  exports: [],
})
export class InterfaceModule {}

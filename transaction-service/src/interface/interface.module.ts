import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from 'src/application/application.module';

@Module({
  imports: [ApplicationModule, CqrsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class InterfaceModule {}

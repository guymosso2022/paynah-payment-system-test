import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { InterfaceModule } from './interface/interface.module';

@Module({
  imports: [InfrastructureModule, InterfaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

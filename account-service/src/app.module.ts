import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/insfracture.module';
import { InterfaceModule } from './interface/interface.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    InterfaceModule,
    InfrastructureModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

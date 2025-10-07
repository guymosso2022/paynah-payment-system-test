import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          clientId: 'account-service',
        },
        consumer: {
          groupId: 'accounts-consumer-group',
          allowAutoTopicCreation: true,
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );
  await kafkaApp.listen();
  console.log('Kafka microservice is listening...');

  const httpApp = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Accounts Service API')
    .setDescription('API for managing accounts, credits, and debits')
    .setVersion('1.0')
    .addTag('accounts')
    .build();

  const document = SwaggerModule.createDocument(httpApp, config);

  SwaggerModule.setup('api/docs', httpApp, document);

  const port = process.env.PORT ?? 3000;
  await httpApp.listen(port);
  console.log(`HTTP server listening on port ${port}`);
}

bootstrap();

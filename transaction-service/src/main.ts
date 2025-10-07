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
          clientId: process.env.KAFKA_CLIENT_ID ?? 'transaction-service',
          brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
        },
        consumer: {
          groupId:
            process.env.KAFKA_CONSUMER_GROUP ?? 'transaction-consumer-group',
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
    .setTitle('Transaction Service API')
    .setDescription('API for managing transaction')
    .setVersion('1.0')
    .addTag('transaction')
    .build();

  const document = SwaggerModule.createDocument(httpApp, config);

  SwaggerModule.setup('api/docs', httpApp, document);
  const port = process.env.PORT ?? 3002;
  await httpApp.listen(port);
  console.log(`HTTP server listening on port ${port}`);
}

bootstrap();

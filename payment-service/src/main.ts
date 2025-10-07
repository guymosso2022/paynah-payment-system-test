import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          clientId: 'payment-service',
        },
        consumer: {
          groupId: 'payment-consumer-group',
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
    .setTitle('Payments API')
    .setDescription('API for payments')
    .setVersion('1.0')
    .addTag('payments')
    .build();

  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api/docs', httpApp, document);

  const port = process.env.PORT ?? 3003;
  await httpApp.listen(port);
  console.log(`HTTP server listening on port ${port}`);
}

bootstrap();

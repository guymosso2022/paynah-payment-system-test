import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || [
    'localhost:9092',
  ];
  const kafkaClientId = process.env.KAFKA_CLIENT_ID || 'payment-service';
  const kafkaGroupId = process.env.KAFKA_GROUP_ID || 'payment-consumer-group';
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: kafkaBrokers,
          clientId: kafkaClientId,
        },
        consumer: {
          groupId: kafkaGroupId,
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

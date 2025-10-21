import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import {
  IEVENT_SUBSCRIBER_PORT,
  IEventSubscriberPort,
} from 'src/domain/ports/event-subcriber.port';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka: Kafka;

  constructor(
    private readonly configService: ConfigService,
    @Inject(IEVENT_SUBSCRIBER_PORT)
    private readonly subscriber: IEventSubscriberPort,
  ) {
    this.kafka = new Kafka({
      clientId:
        this.configService.get<string>('KAFKA_CLIENT_ID') ||
        'transaction-service',
      brokers: (
        this.configService.get<string>('KAFKA_BROKERS') || 'localhost:9092'
      ).split(','),
    });
  }

  private async initConsumer(
    groupId: string,
    topic: string,
    eachMessage: (message: any) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({
      groupId,
      retry: { retries: 0 },
    });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const parsed = JSON.parse(message.value.toString());
        await eachMessage(parsed);
      },
    });
  }

  async onModuleInit() {
    await this.initConsumer(
      'account-payment-group',
      'payment-create-integration-events',
      async (parsed) => {
        console.log('[payment-create-integration-events]', parsed);
        await this.subscriber.consumePaymentCreated(
          parsed.payload.paymentId,
          parsed.payload.sourceAccountId,
          parsed.payload.targetAccountId,
          parsed.payload.amount,
          parsed.payload.currency,
        );
      },
    );
  }
}

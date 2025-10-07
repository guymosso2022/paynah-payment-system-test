import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  IEVENT_SUBSCRIBER_PORT,
  IEventSubscriberPort,
} from 'src/domain/ports/event-subcriber.port';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'transaction-service',
    brokers: ['localhost:9092'],
  });

  constructor(
    @Inject(IEVENT_SUBSCRIBER_PORT)
    private readonly subscriber: IEventSubscriberPort,
  ) {}

  private async initConsumer(
    groupId: string,
    topic: string,
    eachMessage: (message: any) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({
      groupId,
      // sessionTimeout: 30000,
      // heartbeatInterval: 3000,
      // rebalanceTimeout: 60000,
      // allowAutoTopicCreation: true,
      retry: {
        retries: 0, // ne retente pas automatiquement
      },
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
        await await this.subscriber.consumePaymentCreated(
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

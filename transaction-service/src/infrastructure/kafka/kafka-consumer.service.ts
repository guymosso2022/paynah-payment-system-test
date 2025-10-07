import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  IEVENT_SUBSCRIBER_PORT,
  IEventSubscriberPort,
} from 'src/domain/ports/event-suscriber.port';

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

  async onModuleInit() {
    await this.startConsumer('transaction-debit-group', [
      'account-debited-integration-events',
    ]);

    await this.startConsumer('transaction-credit-group', [
      'account-credited-integration-events',
      'payment-account-created-integration-events',
    ]);
  }

  private async startConsumer(groupId: string, topics: string[]) {
    const consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      rebalanceTimeout: 60000,
    });

    await consumer.connect();

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;
        const parsed = JSON.parse(message.value.toString());

        try {
          switch (topic) {
            case 'account-debited-integration-events':
              console.log(`[${topic}]`, parsed);
              await this.subscriber.consumeAccountCredited(
                parsed.payload.accountId,
                parsed.payload.amount,
                parsed.payload.type,
                parsed.payload.status,
              );
              break;

            case 'account-credited-integration-events':
              console.log(`[${topic}]`, parsed);
              await this.subscriber.consumeAccountCredited(
                parsed.payload.accountId,
                parsed.payload.amount,
                parsed.payload.type,
                parsed.payload.status,
              );
              break;

            case 'payment-account-created-integration-events':
              console.log(`[${topic}]`, parsed);
              await this.subscriber.consumeAccountPayment(
                parsed.payload.sourceAccountId,
                parsed.payload.amount,
                parsed.payload.currency,
                parsed.payload.status,
                parsed.payload.paymentId,
              );
              break;
          }
        } catch (err) {
          console.error(`Erreur traitement ${topic}`, err);
        }
      },
    });
  }
}

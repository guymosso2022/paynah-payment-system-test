import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import {
  IEVENT_SUBSCRIBER_PORT,
  IEventSubscriberPort,
} from 'src/domain/ports/event-suscriber.port';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);

  private kafka: Kafka;

  constructor(
    @Inject(IEVENT_SUBSCRIBER_PORT)
    private readonly subscriber: IEventSubscriberPort,
  ) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID ?? 'transaction-service',
      brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
    });
  }

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
    const consumer: Consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      rebalanceTimeout: 60000,
    });

    await consumer.connect();
    this.logger.log(`Kafka consumer connected for group ${groupId}`);

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: true });
      this.logger.log(`Subscribed to topic ${topic}`);
    }

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;

        try {
          const parsed = JSON.parse(message.value.toString());
          await this.handleMessage(topic, parsed);
        } catch (err) {
          this.logger.error(
            `Error while parsing message from topic ${topic}`,
            err.stack,
          );
        }
      },
    });
  }

  private async handleMessage(topic: string, parsed: any) {
    try {
      switch (topic) {
        case 'account-debited-integration-events':
          this.logger.log(`[${topic}] message reçu: ${JSON.stringify(parsed)}`);
          await this.subscriber.consumeAccountDebited(
            parsed.payload.accountId,
            parsed.payload.amount,
            parsed.payload.type,
            parsed.payload.status,
            parsed.payload.currency,
          );
          break;
        case 'account-credited-integration-events':
          this.logger.log(`[${topic}] message reçu: ${JSON.stringify(parsed)}`);
          await this.subscriber.consumeAccountCredited(
            parsed.payload.accountId,
            parsed.payload.amount,
            parsed.payload.type,
            parsed.payload.status,
            parsed.payload.currency,
          );
          break;

        case 'payment-account-created-integration-events':
          this.logger.log(`[${topic}] message reçu: ${JSON.stringify(parsed)}`);
          await this.subscriber.consumeAccountPayment(
            parsed.payload.sourceAccountId,
            parsed.payload.amount,
            parsed.payload.currency,
            parsed.payload.status,
            parsed.payload.paymentId,
            parsed.payload.targetAccountId,
          );
          break;

        default:
          this.logger.warn(`Topic non géré: ${topic}`);
      }
    } catch (err) {
      this.logger.error(
        `Erreur traitement message du topic ${topic}`,
        err.stack,
      );
    }
  }
}

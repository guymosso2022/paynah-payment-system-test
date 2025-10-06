import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
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

  private async initConsumer(
    groupId: string,
    topic: string,
    eachMessage: (message: any) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      rebalanceTimeout: 60000,
      allowAutoTopicCreation: true,
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
      'transaction-debit-group',
      'account-debited-integration-events',
      async (parsed) => {
        const payload = JSON.parse(parsed.value.toString());
        console.log('[account-debited-integration-events]', payload);
        await await this.subscriber.consumeAccountCredited(
          parsed.payload.accountId,
          parsed.payload.amount,
          parsed.payload.type,
          parsed.payload.status,
        );
      },
    );
    await this.initConsumer(
      'transaction-credit-group',
      'account-credited-integration-events',
      async (parsed) => {
        console.log('[account-credited-integration-events]', parsed);
        await await this.subscriber.consumeAccountCredited(
          parsed.payload.accountId,
          parsed.payload.amount,
          parsed.payload.type,
          parsed.payload.status,
        );
      },
    );
  }
}

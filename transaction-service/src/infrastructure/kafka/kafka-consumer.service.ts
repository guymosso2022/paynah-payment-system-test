import { Injectable, OnModuleInit } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'transaction-service',
    brokers: ['localhost:9092'],
  });

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
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
        console.log('[account-debited-integration-events]', parsed);
      },
    );

    // Consumer transfert échoué
    await this.initConsumer(
      'transaction-credit-group',
      'account-credited-integration-events',
      async (parsed) => {
        console.log('[account-credited-integration-events]', parsed);
      },
    );
  }
}

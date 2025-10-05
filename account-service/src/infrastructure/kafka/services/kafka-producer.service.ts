import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { KafkaPublishFailedException } from 'src/infrastructure/exceptions/kafka-publish-failed.exception';
import { KafkaTopicNotFoundException } from 'src/infrastructure/exceptions/kafka-topicnot-found.exception';
import { EventFactory } from 'src/infrastructure/factories/event.factory';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly topicMapping: Record<string, string> = {
    AccountCreditedIntegrationEvent: 'account-credited-integration-events',
    AccountDebitedIntegrationEvent: 'account-debited-integration-events',
  };

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly eventFactory: EventFactory,
  ) {}
  async onModuleInit() {
    console.log('[KafkaEventPublisher] Connecting Kafka client...');
    await this.kafkaClient.connect();
    console.log('[KafkaEventPublisher] Connecting Kafka client!!!!!');
  }

  async publish<T extends object>(event: T): Promise<void> {
    const infraEvent = this.eventFactory.toInfrastructureEvent(event);

    const topic = this.topicMapping[infraEvent.constructor.name];
    if (!topic) {
      console.error(
        `[KafkaEventPublisher] No topic mapped for event: ${event.constructor.name}`,
      );
      throw new KafkaTopicNotFoundException(event.constructor.name);
    }

    try {
      await firstValueFrom(
        this.kafkaClient.emit(topic, {
          type: event.constructor.name,
          payload: infraEvent,
        }),
      );

      console.log(
        `[KafkaEventPublisher] Event successfully published to topic ${topic}`,
        infraEvent,
      );
    } catch (error) {
      console.error(
        `[KafkaEventPublisher] Failed to publish event to topic ${topic}`,
        error,
      );
      throw new KafkaPublishFailedException(topic, error);
    }
  }
}

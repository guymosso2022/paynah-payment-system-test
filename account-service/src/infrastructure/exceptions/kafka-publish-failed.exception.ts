import { KafkaException } from './kafka.exception';

export class KafkaPublishFailedException extends KafkaException {
  constructor(topic: string, error?: unknown) {
    super(`Failed to publish event to Kafka topic "${topic}"`);
    this.name = 'KafkaPublishFailedException';
  }
}

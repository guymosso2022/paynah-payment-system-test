import { KafkaException } from './kafka.exception';

export class KafkaTopicNotFoundException extends KafkaException {
  constructor(eventName: string) {
    super(`No Kafka topic mapped for event: ${eventName}`);
    this.name = 'KafkaTopicNotFoundException';
  }
}

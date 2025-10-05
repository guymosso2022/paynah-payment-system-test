import { KafkaException } from './kafka.exception';

export class KafkaConsumerException extends KafkaException {
  constructor(message = 'Kafka consumer error') {
    super(message);
    this.name = 'KafkaConsumerException';
  }
}

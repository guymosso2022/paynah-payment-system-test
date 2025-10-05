import { KafkaException } from './kafka.exception';

export class KafkaProducerException extends KafkaException {
  constructor(message = 'Kafka producer error') {
    super(message);
    this.name = 'KafkaProducerException';
  }
}

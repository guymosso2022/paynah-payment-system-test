import { KafkaException } from './kafka.exception';

export class KafkaConnectionException extends KafkaException {
  constructor(message = 'Kafka connection failed') {
    super(message);
    this.name = 'KafkaConnectionException';
  }
}

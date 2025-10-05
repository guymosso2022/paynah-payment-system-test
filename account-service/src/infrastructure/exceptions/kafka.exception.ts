export class KafkaException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KafkaException';
  }
}

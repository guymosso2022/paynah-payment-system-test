export class InvalidTransactionIdDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTransactionIdDomainException';
  }
}

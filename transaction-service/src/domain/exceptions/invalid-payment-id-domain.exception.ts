export class InvalidPaymentIdDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPaymentIdDomainException';
  }
}

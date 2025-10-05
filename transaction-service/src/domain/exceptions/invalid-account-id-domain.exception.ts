export class InvalidAccountIdDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAccountIdDomainException';
  }
}

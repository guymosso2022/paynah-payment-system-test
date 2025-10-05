export class InsufficientFundsDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientFundsDomainException';
  }
}

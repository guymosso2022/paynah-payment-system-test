export class InsufficientFundsApplicationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientFundsApplicationException';
  }
}

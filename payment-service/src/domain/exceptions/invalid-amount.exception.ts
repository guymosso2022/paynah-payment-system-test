export class InvalidAmountException extends Error {
  constructor() {
    super('Amount must be positive');
    this.name = 'InvalidAmountException';
  }
}

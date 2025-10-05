export class NegativeMoneyValueDomainException extends Error {
  constructor(value: number) {
    super(`Money amount cannot be negative: ${value}`);
    this.name = 'NegativeMoneyValueDomainException';
  }
}

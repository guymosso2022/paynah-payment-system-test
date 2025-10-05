export class InvalidMoneyValueDomainException extends Error {
  constructor(value: number) {
    super(`Invalid money value: ${value}`);
    this.name = 'InvalidMoneyValueDomainException';
  }
}

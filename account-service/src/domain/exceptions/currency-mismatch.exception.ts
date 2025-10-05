export class CurrencyMismatchDomainException extends Error {
  constructor(message?: string) {
    super(message ?? 'Currency mismatch between Money values');
    this.name = 'CurrencyMismatchDomainException';
  }
}

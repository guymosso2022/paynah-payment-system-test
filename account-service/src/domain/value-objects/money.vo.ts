import { CurrencyMismatchDomainException } from '../exceptions/currency-mismatch.exception';
import { InvalidMoneyValueDomainException } from '../exceptions/invalid-money-value-domain.exception';
import { NegativeMoneyValueDomainException } from '../exceptions/megative-money-value-domain.exception';

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {
    if (!Number.isFinite(amount))
      throw new InvalidMoneyValueDomainException(amount);
    if (amount < 0) throw new NegativeMoneyValueDomainException(amount);
  }

  get value(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  static from(amount: number, currency: string = 'XOF'): Money {
    return new Money(amount, currency);
  }
}

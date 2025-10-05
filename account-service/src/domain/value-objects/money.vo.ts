import { InvalidMoneyValueDomainException } from '../exceptions/invalid-money-value-domain.exception';
import { NegativeMoneyValueDomainException } from '../exceptions/megative-money-value-domain.exception';

export class Money {
  private constructor(private readonly amount: number) {
    if (!Number.isFinite(amount)) {
      throw new InvalidMoneyValueDomainException(amount);
    }
    if (amount < 0) {
      throw new NegativeMoneyValueDomainException(amount);
    }
  }

  get value(): number {
    return this.amount;
  }

  static from(amount: number): Money {
    return new Money(amount);
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  lessThan(other: Money): boolean {
    return this.amount < other.amount;
  }

  subtract(other: Money): Money {
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new NegativeMoneyValueDomainException(result);
    }
    return new Money(result);
  }
}

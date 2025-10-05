import { IMoneyCalculator } from 'src/domain/ports/money-calculator';
import { Money } from 'src/domain/value-objects/money.vo';
import { CurrencyMismatchDomainException } from '../exceptions/currency-mismatch.exception';
import { InsufficientFundsDomainException } from '../exceptions/insufficient-funds-domain.exception';

export class MoneyCalculator implements IMoneyCalculator {
  add(current: Money, amount: Money): Money {
    if (current.getCurrency() !== amount.getCurrency()) {
      throw new CurrencyMismatchDomainException('Currency mismatch');
    }
    return Money.from(current.value + amount.value, current.getCurrency());
  }

  subtract(current: Money, amount: Money): Money {
    if (current.getCurrency() !== amount.getCurrency()) {
      throw new CurrencyMismatchDomainException('Currency mismatch');
    }
    if (this.lessThan(current, amount)) {
      throw new InsufficientFundsDomainException('Insufficient funds');
    }
    return Money.from(current.value - amount.value, current.getCurrency());
  }

  lessThan(current: Money, amount: Money): boolean {
    if (current.getCurrency() !== amount.getCurrency()) {
      throw new CurrencyMismatchDomainException('Currency mismatch');
    }
    return current.value < amount.value;
  }
}

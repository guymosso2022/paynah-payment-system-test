import { InsufficientFundsDomainException } from '../exceptions/insufficient-funds-domain.exception';
import { IMoneyCalculator } from '../ports/money-calculator';
import { AccountId } from '../value-objects/account-id.vo';
import { Money } from '../value-objects/money.vo';

export class Account {
  private constructor(
    public readonly id: AccountId,
    private balance: Money,
    private readonly calculator: IMoneyCalculator,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    this.validate();
  }

  private validate() {}

  static create(
    id: AccountId,
    initialBalance: Money,
    calculator: IMoneyCalculator,
  ): Account {
    return new Account(id, initialBalance, calculator);
  }

  credit(amount: Money): void {
    this.balance = this.calculator.add(this.balance, amount);
    this.updatedAt = new Date();
  }

  debit(amount: Money): void {
    if (this.calculator.lessThan(this.balance, amount)) {
      throw new InsufficientFundsDomainException('Insufficient funds');
    }
    this.balance = this.calculator.subtract(this.balance, amount);
    this.updatedAt = new Date();
  }

  getBalance(): Money {
    return this.balance;
  }

  getId(): AccountId {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id.value,
      balance: this.balance.value,
      currency: this.balance.getCurrency(),
      createdAt: this.createdAt ?? new Date(),
      updatedAt: this.updatedAt,
    };
  }
}

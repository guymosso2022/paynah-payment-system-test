export class Money {
  // getValue() {
  //   throw new Error('Method not implemented.');
  // }
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string,
  ) {}

  static from(amount: number, currency: string = 'XOF'): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return new Money(amount, currency);
  }

  get value(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this._amount - other._amount;
    if (result < 0) throw new Error('Resulting amount cannot be negative');
    return new Money(result, this._currency);
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  isNegative(): boolean {
    return this._amount < 0;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  private assertSameCurrency(other: Money) {
    if (this._currency !== other._currency) {
      throw new Error('Cannot operate on Money with different currencies');
    }
  }

  toJSON() {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }
}

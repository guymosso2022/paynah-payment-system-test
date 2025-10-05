import { Money } from '../value-objects/money.vo';

export const IMONEY_CALCULATOR_PORT = Symbol('IMoneyCalculator');
export interface IMoneyCalculator {
  add(current: Money, amount: Money): Money;
  subtract(current: Money, amount: Money): Money;
  lessThan(current: Money, amount: Money): boolean;
}

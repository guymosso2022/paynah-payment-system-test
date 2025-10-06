import { InvalidAccountIdException } from '../exceptions/invalid-account-id.exception';

export class AccountId {
  constructor(private readonly id: string) {
    if (!id || id.trim() === '') {
      throw new InvalidAccountIdException('Account ID cannot be empty');
    }
  }

  get value(): string {
    return this.id;
  }

  equals(other: AccountId): boolean {
    return this.value === other.value;
  }

  static create(id: string): AccountId {
    return new AccountId(id);
  }

  getValue(): string {
    return this.value;
  }
}

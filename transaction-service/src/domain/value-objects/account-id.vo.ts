import { InvalidAccountIdDomainException } from '../exceptions/invalid-account-id-domain.exception';

export class AccountId {
  constructor(private readonly id: string) {
    if (!id || id.trim() === '') {
      throw new InvalidAccountIdDomainException('Account ID cannot be empty');
    }
    this.id = id;
  }

  get value(): string {
    return this.id;
  }

  public toString(): string {
    return this.id;
  }

  public getValue(): string {
    return this.id;
  }

  static create(id: string): AccountId {
    return new AccountId(id);
  }
}

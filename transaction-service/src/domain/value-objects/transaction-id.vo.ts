import { InvalidTransactionIdDomainException } from '../exceptions/invalid-transaction-id-domain.exception';

export class TransactionId {
  constructor(private readonly id: string) {
    if (!id || id.trim() === '') {
      throw new InvalidTransactionIdDomainException(
        'transaction ID cannot be empty',
      );
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

  static create(id: string): TransactionId {
    return new TransactionId(id);
  }
}

import { InvalidPaymentIdDomainException } from '../exceptions/invalid-payment-id-domain.exception';

export class PaymentId {
  constructor(private readonly id: string) {
    if (!id || id.trim() === '') {
      throw new InvalidPaymentIdDomainException('Payment ID cannot be empty');
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

  static create(id: string): PaymentId {
    return new PaymentId(id);
  }
}

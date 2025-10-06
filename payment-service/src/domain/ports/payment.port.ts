import { Payment } from '../entities/payment.entity';
import { PaymentId } from '../value-objects/payment-id.vo';

export const IPAYMENT_REPOSITORY_PORT = Symbol('IPaymentRepositoryPort');

export interface IPaymentRepositoryPort {
  save(payment: Payment): Promise<Payment>;
  findOne(id: PaymentId): Promise<Payment | null>;
}

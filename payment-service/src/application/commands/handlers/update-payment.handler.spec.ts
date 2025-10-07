import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePaymentHandler } from './update-payment.handler';
import {
  IPAYMENT_REPOSITORY_PORT,
  IPaymentRepositoryPort,
} from 'src/domain/ports/payment.port';
import { Payment } from 'src/domain/entities/payment.entity';
import { UpdatePaymentCommand } from '../update-payment.command';
import { PaymentId } from 'src/domain/value-objects/payment-id.vo';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';

describe('UpdatePaymentHandler', () => {
  let handler: UpdatePaymentHandler;
  let mockPaymentRepository: IPaymentRepositoryPort;

  beforeEach(async () => {
    mockPaymentRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePaymentHandler,
        { provide: IPAYMENT_REPOSITORY_PORT, useValue: mockPaymentRepository },
      ],
    }).compile();

    handler = module.get<UpdatePaymentHandler>(UpdatePaymentHandler);
  });

  it('should update payment status and save it', async () => {
    const paymentId = PaymentId.create('payment-1');
    const payment = Payment.create(
      paymentId,
      AccountId.create('source-123'),
      AccountId.create('target-456'),
      Money.from(100, 'XOF'),
    );

    (mockPaymentRepository.findOne as jest.Mock).mockResolvedValue(payment);
    (mockPaymentRepository.save as jest.Mock).mockResolvedValue(payment);

    const command = new UpdatePaymentCommand('payment-1', 'TRANSFER_COMPLETED');

    await handler.execute(command);

    expect(payment.getStatus()).toBe('SUCCESS');
    expect(mockPaymentRepository.findOne).toHaveBeenCalledWith(paymentId);
    expect(mockPaymentRepository.save).toHaveBeenCalledWith(payment);
  });

  it('should do nothing if payment not found', async () => {
    (mockPaymentRepository.findOne as jest.Mock).mockResolvedValue(null);
    const command = new UpdatePaymentCommand(
      'non-existent',
      'TRANSFER_COMPLETED',
    );

    await handler.execute(command);

    expect(mockPaymentRepository.save).not.toHaveBeenCalled();
  });
});

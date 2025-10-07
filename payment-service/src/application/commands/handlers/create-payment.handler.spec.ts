import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentHandler } from '../handlers/create-payment.handler';
import { IPAYMENT_REPOSITORY_PORT } from 'src/domain/ports/payment.port';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { IEVENT_PUBLISHER_PORT } from 'src/domain/ports/event-publisher.port';
import { Payment } from 'src/domain/entities/payment.entity';
import { PaymentId } from 'src/domain/value-objects/payment-id.vo';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { CreatePaymentCommand } from '../create-payment.command';
import { PaymentCreatedEvent } from 'src/domain/events/payment-created.event';

describe('CreatePaymentHandler', () => {
  let handler: CreatePaymentHandler;

  const mockPaymentRepository = { save: jest.fn() };
  const mockIdGenerator = { generate: jest.fn() };
  const mockEventPublisher = { publish: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentHandler,
        { provide: IPAYMENT_REPOSITORY_PORT, useValue: mockPaymentRepository },
        { provide: IUNIQUE_ID_GENERATOR_PORT, useValue: mockIdGenerator },
        { provide: IEVENT_PUBLISHER_PORT, useValue: mockEventPublisher },
      ],
    }).compile();

    handler = module.get<CreatePaymentHandler>(CreatePaymentHandler);

    jest.clearAllMocks();
  });

  it('should create a payment and publish a PaymentCreatedEvent', async () => {
    const command = new CreatePaymentCommand(
      100,
      'source-123',
      'target-456',
      'XOF',
    );

    mockIdGenerator.generate.mockReturnValue('payment-1');

    const payment = Payment.create(
      PaymentId.create('payment-1'),
      AccountId.create('source-123'),
      AccountId.create('target-456'),
      Money.from(100, 'XOF'),
    );

    mockPaymentRepository.save.mockResolvedValue(payment);

    const result = await handler.execute(command);

    expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockPaymentRepository.save).toHaveBeenCalledWith(
      expect.any(Payment),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.any(PaymentCreatedEvent),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(Payment);
    expect(result.getAmount().value).toBe(100);
    expect(result.getCurrency()).toBe('XOF');
  });
});

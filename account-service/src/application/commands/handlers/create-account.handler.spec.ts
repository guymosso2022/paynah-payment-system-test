import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountHandler } from './create-account.handler';
import { IACCOUNT_REPOSITORY_PORT } from 'src/domain/ports/account.port';
import { IUNIQUE_ID_GENERATOR_PORT } from 'src/domain/ports/unique-id-generator.port';
import { Account } from 'src/domain/entities/account.entity';
import { AccountId } from 'src/domain/value-objects/account-id.vo';
import { Money } from 'src/domain/value-objects/money.vo';
import { MoneyCalculator } from 'src/domain/services/money-calculator.service';
import { IMONEY_CALCULATOR_PORT } from 'src/domain/ports/money-calculator';
import { CreateAccountCommand } from '../create-account.command';

describe('CreateAccountHandler', () => {
  let handler: CreateAccountHandler;

  const mockAccountRepository = {
    save: jest.fn(),
  };

  const mockIdGenerator = {
    generate: jest.fn(),
  };

  const mockCalculator = new MoneyCalculator();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountHandler,
        { provide: IACCOUNT_REPOSITORY_PORT, useValue: mockAccountRepository },
        { provide: IUNIQUE_ID_GENERATOR_PORT, useValue: mockIdGenerator },
        { provide: IMONEY_CALCULATOR_PORT, useValue: mockCalculator },
      ],
    }).compile();

    handler = module.get<CreateAccountHandler>(CreateAccountHandler);
    jest.clearAllMocks();
  });

  it('should create an account with initial balance and save it', async () => {
    const command = new CreateAccountCommand(100, 'XOF');
    mockIdGenerator.generate.mockReturnValue('account-1');

    const account = Account.create(
      AccountId.create('account-1'),
      Money.from(100, 'XOF'),
      mockCalculator,
    );

    mockAccountRepository.save.mockResolvedValue(account);

    const result = await handler.execute(command);

    expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockAccountRepository.save).toHaveBeenCalledWith(
      expect.any(Account),
    );
    expect(result).toBeInstanceOf(Account);
    expect(result.getBalance().value).toBe(100);
    expect(result.getBalance().getCurrency()).toBe('XOF');
  });
});

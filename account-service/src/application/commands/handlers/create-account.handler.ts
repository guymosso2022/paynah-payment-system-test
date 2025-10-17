import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from '../create-account.command';
import { Inject } from '@nestjs/common';
import {
  IACCOUNT_REPOSITORY_PORT,
  IAccountRepositoryPort,
} from 'src/domain/ports/account.port';
import {
  IUNIQUE_ID_GENERATOR_PORT,
  IUniqueIdGeneratorPort,
} from 'src/domain/ports/unique-id-generator.port';
import {
  IMONEY_CALCULATOR_PORT,
  IMoneyCalculator,
} from 'src/domain/ports/money-calculator';
import { Money } from 'src/domain/value-objects/money.vo';
import { Account } from 'src/domain/entities/account.entity';
import { AccountId } from 'src/domain/value-objects/account-id.vo';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    @Inject(IACCOUNT_REPOSITORY_PORT)
    private readonly accountRepository: IAccountRepositoryPort,
    @Inject(IUNIQUE_ID_GENERATOR_PORT)
    private readonly uniqueIdGenerator: IUniqueIdGeneratorPort,
    @Inject(IMONEY_CALCULATOR_PORT)
    private readonly calculator: IMoneyCalculator,
  ) {}
  async execute(command: CreateAccountCommand): Promise<Account> {
    const id = this.uniqueIdGenerator.generate();
    const accountId = AccountId.create(id);
    const initialBalance = Money.from(command.amount || 0);
    const account = Account.create(accountId, initialBalance, this.calculator);

    const savedAccount = await this.accountRepository.save(account);
    return savedAccount;
  }
}

import { Inject } from '@nestjs/common';
import { AccountCreditedEvent } from 'src/domain/events/account-credited.event';
import {
  IUNIQUE_ID_GENERATOR_PORT,
  IUniqueIdGeneratorPort,
} from 'src/domain/ports/unique-id-generator.port';
import { AccountCreditedIntegrationEvent } from '../events/account-credited-integration.event';
import { KafkaTopicNotFoundException } from '../exceptions/kafka-topicnot-found.exception';
import { AccountDebitedEvent } from 'src/domain/events/account-debited.event';
import { AccountDebitedIntegrationEvent } from '../events/account-debited-integration.event';

export class EventFactory {
  constructor(
    @Inject(IUNIQUE_ID_GENERATOR_PORT)
    private readonly uniqueIdGenerator: IUniqueIdGeneratorPort,
  ) {}

  toInfrastructureEvent(domainEvent: any): any {
    if (domainEvent instanceof AccountCreditedEvent) {
      return new AccountCreditedIntegrationEvent(
        this.uniqueIdGenerator.generate(),
        domainEvent.accountId,
        domainEvent.balance,
        'CREDIT',
        new Date(),
      );
    }
    if (domainEvent instanceof AccountDebitedEvent) {
      return new AccountDebitedIntegrationEvent(
        this.uniqueIdGenerator.generate(),
        domainEvent.accountId,
        domainEvent.balance,
        'DEBIT',
        new Date(),
      );
    }
    throw new KafkaTopicNotFoundException(domainEvent.constructor.name);
  }
}

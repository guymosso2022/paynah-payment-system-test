import { Inject, Injectable } from '@nestjs/common';
import { AccountCreditedEvent } from 'src/domain/events/account-credited.event';
import {
  IUNIQUE_ID_GENERATOR_PORT,
  IUniqueIdGeneratorPort,
} from 'src/domain/ports/unique-id-generator.port';
import { AccountCreditedIntegrationEvent } from '../events/account-credited-integration.event';
import { KafkaTopicNotFoundException } from '../exceptions/kafka-topicnot-found.exception';
import { AccountDebitedEvent } from 'src/domain/events/account-debited.event';
import { AccountDebitedIntegrationEvent } from '../events/account-debited-integration.event';
import { PaymentCreatedIntegrationEvent } from '../events/payment-created-integration.events';
import { PaymentCreatedEvent } from 'src/domain/events/payment-created.event';

@Injectable()
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
        domainEvent.type,
        domainEvent.status,
        domainEvent.currency,
        new Date(),
      );
    }
    if (domainEvent instanceof AccountDebitedEvent) {
      return new AccountDebitedIntegrationEvent(
        this.uniqueIdGenerator.generate(),
        domainEvent.accountId,
        domainEvent.balance,
        domainEvent.type,
        domainEvent.status,
        domainEvent.currency,
        new Date(),
      );
    }
    if (domainEvent instanceof PaymentCreatedEvent) {
      return new PaymentCreatedIntegrationEvent(
        this.uniqueIdGenerator.generate(),
        domainEvent.sourceAccountId,
        domainEvent.targetAccountId,
        domainEvent.amount,
        domainEvent.currency,
        domainEvent.status,
        domainEvent.paymentId,
        new Date(),
      );
    }
    throw new KafkaTopicNotFoundException(domainEvent.constructor.name);
  }
}

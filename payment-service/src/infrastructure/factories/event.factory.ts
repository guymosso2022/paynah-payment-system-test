import { Inject } from '@nestjs/common';
import { PaymentCreatedEvent } from 'src/domain/events/payment-created.event';
import {
  IUNIQUE_ID_GENERATOR_PORT,
  IUniqueIdGeneratorPort,
} from 'src/domain/ports/unique-id-generator.port';
import { PaymentCreatedIntegrationEvent } from '../events/paymentcreated-intgration.event';

export class EventFactory {
  constructor(
    @Inject(IUNIQUE_ID_GENERATOR_PORT)
    private readonly uniqueIdGenerator: IUniqueIdGeneratorPort,
  ) {}

  toInfrastructureEvent(domainEvent: any): any {
    if (domainEvent instanceof PaymentCreatedEvent) {
      return new PaymentCreatedIntegrationEvent(
        this.uniqueIdGenerator.generate(),
        domainEvent.paymentId,
        domainEvent.sourceAccountId,
        domainEvent.targetAccountId,
        domainEvent.amount,
        domainEvent.currency,
        new Date(),
      );
    }
  }
}

import { Inject } from '@nestjs/common';
import {
  IUNIQUE_ID_GENERATOR_PORT,
  IUniqueIdGeneratorPort,
} from 'src/domain/ports/unique-id-generator.port';

export class EventFactory {
  constructor(
    @Inject(IUNIQUE_ID_GENERATOR_PORT)
    private readonly uniqueIdGenerator: IUniqueIdGeneratorPort,
  ) {}

  toInfrastructureEvent(domainEvent: any): any {}
}

import { IUniqueIdGeneratorPort } from 'src/domain/ports/unique-id-generator.port';
import { v4 as uuidv4 } from 'uuid';

export class UuidV4Generator implements IUniqueIdGeneratorPort {
  generate(): string {
    return uuidv4();
  }
}

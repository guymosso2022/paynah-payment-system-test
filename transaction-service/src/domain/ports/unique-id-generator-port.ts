export const IUNIQUE_ID_GENERATOR_PORT = Symbol('IUniqueIdGeneratorPort');

export interface IUniqueIdGeneratorPort {
  generate(): string;
}

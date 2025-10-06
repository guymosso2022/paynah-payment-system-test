export class InvalidAccountIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAccountIdException';
  }
}

export class AccountNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountNotFoundException';
  }
}

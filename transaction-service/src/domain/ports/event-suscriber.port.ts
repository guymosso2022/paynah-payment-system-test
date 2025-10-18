export const IEVENT_SUBSCRIBER_PORT = Symbol('IEventSubscriberPort');

export interface IEventSubscriberPort {
  consumeAccountCredited(
    accountId: string,
    amount: number,
    type: string,
    status: string,
    currency: string,
  ): Promise<void>;

  consumeAccountDebited(
    accountId: string,
    amount: number,
    type: string,
    status: string,
    currency: string,
  ): Promise<void>;

  consumeAccountPayment(
    sourceAccountId: string,
    amount: number,
    currency: string,
    status: string,
    paymentId: string,
    targetAccountId: string,
  ): Promise<void>;
}

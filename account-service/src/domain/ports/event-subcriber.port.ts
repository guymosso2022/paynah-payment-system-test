export const IEVENT_SUBSCRIBER_PORT = Symbol('IEventSubscriberPort');
export interface IEventSubscriberPort {
  consumePaymentCreated(
    parentId: string,
    sourceAccountId: string,
    targetAccountId: string,
    amount: number,
    currency: string,
  ): Promise<void>;
}

export const IEVENT_SUBSCRIBER_PORT = Symbol('IEventSubscriberPort');

export interface IEventSubscriberPort {
  consumeUpdatePayment(paymentId: string, status: string): Promise<void>;
}

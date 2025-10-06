export const IEVENT_SUBSCRIBER_PORT = Symbol('IEventSubscriberPort');

export interface IEventSubscriberPort {
  consumeAccountCredited(
    accountId: string,
    amount: number,
    type: string,
    status: string,
  ): Promise<void>;

  consumeAccountDebited(
    accountId: string,
    amount: number,
    type: string,
    status: string,
  ): Promise<void>;
}

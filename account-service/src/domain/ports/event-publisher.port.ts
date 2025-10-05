export const IEVENT_PUBLISHER_PORT = Symbol('IEventPublisherPort');

export interface IEventPublisherPort {
  publish<T>(event: T): Promise<void>;
}

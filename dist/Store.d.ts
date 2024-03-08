type SubscriptionHandler = {
    (): void;
};
type Subscriber = {
    channel: string;
    handler: SubscriptionHandler;
    key: string | null;
};
type SubscriberKey = string | null;
export default class Store<T> {
    data: T;
    subscribers: Subscriber[];
    constructor(defaults: T);
    emit(...channels: string[]): void;
    channel(channelName: string): {
        emit: () => void;
        flush: (key?: SubscriberKey) => void;
        watch: (handler: SubscriptionHandler) => void;
        useKey: (key?: SubscriberKey) => {
            watch: (handler: SubscriptionHandler) => void;
        };
    };
    channels(): string[];
    hasSubscriber(channel: string): boolean;
    flush(key?: SubscriberKey): void;
    flushChannel(channelName: string, key?: SubscriberKey): void;
    subscribe(channel: string, handler: SubscriptionHandler, key?: SubscriberKey): void;
}
export {};

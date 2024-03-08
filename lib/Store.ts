
type SubscriptionHandler = {
    (): void;
};

type Subscriber = {
    channel: string,
    handler: SubscriptionHandler,
    key: string | null;
};

type SubscriberKey = string | null;

export default class Store<T> {
    public data: T;
    public subscribers: Subscriber[];

    constructor(defaults: T) {
        this.data = defaults;
        this.subscribers = [];
    }

    public emit(...channels: string[]): void {
        for (const channel of channels) {
            for (const subscriber of this.subscribers) {
                if (channel === subscriber.channel) {
                    subscriber.handler();
                }
            }
        }
    }

    public channel(channelName: string) {
        return {
            emit: (): void => this.emit(channelName),
            flush: (key: SubscriberKey = null): void => this.flushChannel(channelName, key),
            watch: (handler: SubscriptionHandler): void => this.subscribe(channelName, handler),
            useKey: (key: SubscriberKey = null) => {
                return {
                    watch: (handler: SubscriptionHandler) => this.subscribe(channelName, handler, key),
                };
            }
        };
    };

    public channels(): string[] {
        const unique = new Set<string>();
        for (const subscriber of this.subscribers) {
            unique.add(subscriber.channel);
        }

        return Array.from(unique);
    };

    public hasSubscriber(channel: string): boolean {
        return this.subscribers.some((subscriber) => subscriber.channel === channel);
    }

    public flush(key: SubscriberKey = null): void {
        if (key === null) {
            this.subscribers = [];
        }

        this.subscribers = this.subscribers.filter(subscriber => {
            return subscriber.key !== key;
        });
    }

    public flushChannel(channelName: string, key: SubscriberKey = null): void {
        this.subscribers = this.subscribers.filter(subscriber => {
            if (subscriber.channel !== channelName) {
                return true;
            }

            if (key === null) {
                return false;
            }

            return subscriber.key !== key;
        });
    }

    public subscribe(channel: string, handler: SubscriptionHandler, key: SubscriberKey = null): void {
        this.subscribers.push({ channel, handler, key });
    }
}
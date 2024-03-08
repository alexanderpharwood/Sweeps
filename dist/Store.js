// lib/Store.ts
class Store {
  data;
  subscribers;
  constructor(defaults) {
    this.data = defaults;
    this.subscribers = [];
  }
  emit(...channels) {
    for (const channel of channels) {
      for (const subscriber of this.subscribers) {
        if (channel === subscriber.channel) {
          subscriber.handler();
        }
      }
    }
  }
  channel(channelName) {
    return {
      emit: () => this.emit(channelName),
      flush: (key = null) => this.flushChannel(channelName, key),
      watch: (handler) => this.subscribe(channelName, handler),
      useKey: (key = null) => {
        return {
          watch: (handler) => this.subscribe(channelName, handler, key)
        };
      }
    };
  }
  channels() {
    const unique = new Set;
    for (const subscriber of this.subscribers) {
      unique.add(subscriber.channel);
    }
    return Array.from(unique);
  }
  hasSubscriber(channel) {
    return this.subscribers.some((subscriber) => subscriber.channel === channel);
  }
  flush(key = null) {
    if (key === null) {
      this.subscribers = [];
    }
    this.subscribers = this.subscribers.filter((subscriber) => {
      return subscriber.key !== key;
    });
  }
  flushChannel(channelName, key = null) {
    this.subscribers = this.subscribers.filter((subscriber) => {
      if (subscriber.channel !== channelName) {
        return true;
      }
      if (key === null) {
        return false;
      }
      return subscriber.key !== key;
    });
  }
  subscribe(channel, handler, key = null) {
    this.subscribers.push({ channel, handler, key });
  }
}
export {
  Store as default
};

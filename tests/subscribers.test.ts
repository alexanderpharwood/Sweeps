import { expect, test } from "bun:test";
import Store from "../lib/Store";

const noopHandler = () => { /*noop*/ };

test("Subscribing to a channel without a key", () => {
    const store = new Store<string>("Willow");
    store.channel("UPDATED").watch(noopHandler);
    expect(store.subscribers.length).toEqual(1);
    expect(store.subscribers[0].channel).toEqual("UPDATED");
    expect(typeof store.subscribers[0].handler).toEqual("function");
    expect(store.subscribers[0].key).toBeNull();
});

test("Subscribing to a channel with a key", () => {
    const store = new Store<string>("Willow");
    store.channel("UPDATED").useKey("test").watch(noopHandler);
    expect(store.subscribers.length).toEqual(1);
    expect(store.subscribers[0].channel).toEqual("UPDATED");
    expect(typeof store.subscribers[0].handler).toEqual("function");
    expect(store.subscribers[0].key).toEqual("test");
});

test("flushing all channels", () => {
    const store = new Store<string>("Willow");
    store.channel("UPDATED").watch(noopHandler);
    store.flush();
    expect(store.subscribers.length).toEqual(0);
});

test("flushing all channels with the given key", () => {
    const store = new Store<string>("Willow");
    store.channel("UPDATED").watch(noopHandler);
    store.channel("UPDATED").useKey("test").watch(noopHandler);
    store.flush("test");
    expect(store.subscribers.length).toEqual(1);
    expect(store.subscribers[0].key).toBeNull();
});

test("flushing a given channel", () => {
    const store = new Store<string>("Willow");
    store.channel("UPDATED").useKey("test").watch(noopHandler);
    store.channel("UPDATED").flush();
    expect(store.subscribers.length).toEqual(0);
});

test("flushing a given channel with the given key", () => {
    const store = new Store<string>("Willow");
    store.channel("UPDATED").watch(noopHandler);
    store.channel("UPDATED").useKey("test").watch(noopHandler);
    store.channel("UPDATED").flush("test");
    expect(store.subscribers.length).toEqual(1);
    expect(store.subscribers[0].key).toBeNull();
});

test("Checking if a subscriber exists for a channel", () => {
    const store = new Store<string>("Willow");
    expect(store.hasSubscriber("UPDATED")).toBeFalse();
    store.channel("UPDATED").watch(noopHandler);
    expect(store.hasSubscriber("UPDATED")).toBeTrue();
});

test("emitting on a given channel onyl calls handlers for that channel", () => {
    const store = new Store<string>("Willow");
    let test;
    const updated = () => test = true;
    const created = () => test = false;
    store.channel("UPDATED").watch(updated);
    store.channel("CREATED").watch(created);
    store.emit("UPDATED");
    expect(test).toBeTrue();
});

test("getting a list of channels", () => {
    const store = new Store<string>("Willow");
    store.channel("UPDATED").watch(noopHandler);

    const channels = store.channels();
    expect(channels).toHaveLength(1);
    expect(channels).toContain("UPDATED");
});
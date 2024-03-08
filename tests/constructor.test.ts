import { expect, test } from "bun:test";
import Store from "../lib/Store";

test("Initialising a new store using a primitive type", () => {
    const store = new Store<string>("Willow");
    expect(store.data).toEqual("Willow");
});

test("Initialising a new store using a custom type", () => {
    type Data = { user: number | null; };
    const data: Data = { user: null };
    const store = new Store<Data>(data);
    expect(store.data.user).toBeNull();
});

interface StoreData {
    user?: {
        name: string,
        email: string,
    };
}

const store = new Store<StoreData>({});
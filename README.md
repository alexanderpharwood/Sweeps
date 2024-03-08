# Sweeps

Sweeps provides a mechanism for handling state and reacting to state changes. It exposes a simple, declerative API to work with your state and subscribers.

The flow is as follows:
1. Create a new store and provide a default state
2. Subscribe to a channel
3. Make some changes to state
4. Emit on a channel to notify subscribers

## Getting started

The first thing to do is decide whether you want to use a singleton. This can be useful in larger applications where components are often deeply nested. But beware: it can also lead to difficult bugs if not managed sensibly. If you choose not to use the singleton pattern, you will have to pass your store instance into every component that needs to access your state.

## Creating a new store

```
interface StoreData {
    user?: {
        name: string,
        email: string,
    }
}

const store = new Store<StoreData>({});
```

The default state here is an empty object. However, it can be anything you like as long as it conforms to the interface you provide.

To use the singleton pattern, you should put the above code into its own module, and export the new instance you just created. Each time you want to access your store, you can import your module and you will receive the same instance of the store each time. If you are not familiar with the singleton pattern, there are lots of resources available online for you to look at before deciding which approach to take.

### Subscribing to a channel

Now you have your store, it's time to add a subscriber. Subscribers watch the given channel and provide a handler function to execute when an emit action is called on the channel.

```
const handler = () => console.log("User was updated!);
store.channel("USER_UPDATED").watch(handler);
```

You can also assign a key to a subscriber to be used as an identifier later on:
```
store.channel("USER_UPDATED").useKey("settings_page").watch(handler);
```

Keys enable you to target specifc subscribers. For example, you might have two subscribers watching the same channel: one in a generic header component, and one on a settings page. When the user navigates away from the settings page and that component unmounts, you might watch to remove the subscriber (and correctly avoid a memory leak). In this example, the header component remains mounted so you want that subscriber to remain active. As both subscribers are watching the same channel, you need a way to tell which subscriber is which and remove the correct one.

### Unsubscribing from a channel

There are a few different ways to unsubscribe from a channel. You can:

1 Remove all subscribers across all channels:
```
store.flush();
```

2. Remove all subscribers across all channels with the matching key (as mentioned above):
```
store.flush("settings_page")
```

3. Remove all subscribers for the given channel:

```
store.channel("USER_UPDATED").flush();
```

4. Remove all subscribers for the given channel with the given key (as mentioned above):
```
store.channel("USER_UPDATED").flush("settings_page")
```

### Emitting on a channel

To emit on a channel:
```
store.channel("USER_UPDATED").emit();
```

You can also emit on many channels at once:
```
store.emit("USER_CREATED", "USER_UPDATED")
```
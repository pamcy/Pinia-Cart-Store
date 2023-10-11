/*
    we create a Pinia plugin to provide reusable undo/redo functionality for our stores. With Pinia plugins you are able do a wide variety of things including:

    Adding custom properties
    Adding custom methods
    Watching the store’s state with dollar sign subscribe
    Limiting the functionality to specific stores with a custom option
    Implement side effects like local storage
    Add new state
    Add new actions/methods
    Wrap existing actions/methods
*/

import { ref, reactive } from "vue";

// A Pinia plugin is a function that optionally returns properties to be added to a store.
export function PiniaHistoryPlugin({
  pinia, // the pinia created with `createPinia()` in main.js
  app, // the root Vue app instance
  store, // the store instance
  options, // options passed to the store
}) {
  const itemHistory = reactive([]);
  const futureHistory = reactive([]);
  const doingHistory = ref(false);

  // record the initial state of the cartStore outside of the $subscribe function
  // $state: we can access the entire state of the store
  itemHistory.push(JSON.stringify(store.$state));

  // ===== Subscribing to a store's state =====
  // https://pinia.vuejs.org/core-concepts/state.html#Subscribing-to-the-state
  // anytime the state changes, this $subscribe function will run

  store.$subscribe((mutation, state) => {
    // import { MutationType } from 'pinia'
    // mutation.type: 'direct' | 'patch object' | 'patch function'

    // same as cartStore.$id
    // mutation.storeId: 'cartStore'

    // only available with mutation.type === 'patch object'
    // mutation.payload: patch object passed to cartStore.$patch()

    // state: the current state after the mutations have completed

    if (!doingHistory.value) {
      // capture the snapshot of the state by pushing it to the itemHistory array
      itemHistory.push(JSON.stringify(state));

      // clear the futureHistory array
      futureHistory.splice(0, futureHistory.length);
    }
  });

  return {
    undo: () => {
      // if there is only one item in the itemHistory array, there is nothing to undo
      // contains the initial state of the cartStore
      if (itemHistory.length === 1) {
        return;
      }

      // prevent the $subscribe function from running
      // since we are altering the state of our cartStore in undo, $subscribe function will run again recording a new record in itemHistory
      doingHistory.value = true;

      // remove the last item from the itemHistory array
      // and push it to the futureHistory array
      futureHistory.push(itemHistory.pop());

      // apply the previous state to the store
      // reset the cartStore's state to the last element in the itemHistory array
      // cartStore.$state: set the entire state of the store at one time
      store.$state = JSON.parse(itemHistory[itemHistory.length - 1]);

      doingHistory.value = false;
    },
    redo: () => {
      const latestState = futureHistory.pop();

      if (!latestState) {
        return;
      }

      doingHistory.value = true;

      itemHistory.push(latestState);

      store.$state = JSON.parse(latestState);

      doingHistory.value = false;
    },
  };
}

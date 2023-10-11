<script setup>
import { ref, reactive } from "vue";

import { useProductStore } from "@/stores/ProductStore";
import { useCartStore } from "@/stores/CartStore";

import TheHeader from "@/components/TheHeader.vue";
import AppButton from "@/components/AppButton.vue";
import ProductCard from "@/components/ProductCard.vue";

const productStore = useProductStore();
const cartStore = useCartStore();

const itemHistory = reactive([]);
const futureHistory = reactive([]);
const doingHistory = ref(false);

// ===== Subscribing to a store's state =====
// https://pinia.vuejs.org/core-concepts/state.html#Subscribing-to-the-state

// Useful:
// 1. Persisting state to localStorage

function undo() {
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
  cartStore.$state = JSON.parse(itemHistory[itemHistory.length - 1]);

  doingHistory.value = false;
}

function redo() {
  const latestState = futureHistory.pop();

  if (!latestState) {
    return;
  }

  doingHistory.value = true;

  itemHistory.push(latestState);

  cartStore.$state = JSON.parse(latestState);

  doingHistory.value = false;
}

// record the initial state of the cartStore outside of the $subscribe function
// $state: we can access the entire state of the store
itemHistory.push(JSON.stringify(cartStore.$state));

// anytime the state changes, this $subscribe function will run
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  // mutation.type // 'direct' | 'patch object' | 'patch function'

  // same as cartStore.$id
  // mutation.storeId // 'cart'

  // only available with mutation.type === 'patch object'
  // mutation.payload // patch object passed to cartStore.$patch()

  // state // the current state after the mutations have completed

  if (!doingHistory.value) {
    // capture the snapshot of the state by pushing it to the itemHistory array
    itemHistory.push(JSON.stringify(state));

    // clear the futureHistory array
    futureHistory.splice(0, futureHistory.length);
  }
});

// ===== Subscribing to a store's actions =====
// Let's say you wanted to trigger some kind of side affect every time an action is called.
// https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions

// Useful:
// 1. Showing notifications to users when a certain action runs
// 2. Recording analytics data for your actions, or using an error monitoring service like Sentry to record errors.

cartStore.$onAction(
  ({
    name, // name of the action
    store, // store instance
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    const startTime = Date.now();

    // this will trigger before an action on `store` is executed
    // Start "addItem" with params [2, [object Object]].
    console.log(`Start "${name}" with params [${args.join(", ")}].`);

    // this will trigger if the action succeeds and after it has fully run.
    // it waits for any returned promised
    // 確認 action 執行完畢
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      );

      // Finished "addItem" after 1ms.
      // Result: undefined.

      // if the action has return anything or resolved a promise, it will be
      // available as the `result` argument
      // otherwise, it will be undefined
    });

    // this will trigger if the action fails or throws
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      );
      // Failed "addItem" after 0ms.
    });

    /**
     * You can also use the name of the action to only listen to a specific action
     * and not all of them.
     */
    // if (name === "addItem") {
    //   after(() => {
    //     console.log(`First argement count: ${args[0]}`);
    //     console.log("items are added");
    //   });
    // }
  }
);

// call the action as a method of the store
productStore.fetchProducts();

/*

function addToCart(count, product) {

  patchFunction

  Mutated the state with $patch and a function
  If you ever want to group multiple direct mutations of the state together
  https://pinia.vuejs.org/api/enums/pinia.MutationType.html#patchFunction
  * 沒有很推薦的作法

  cartStore.$patch((state) => {
    for (let i = 0; i < count; i++) {
      state.items.push(product);
    }
  });

}

*/

/*

// Destructuring from a Store
// Use the 'storeToRefs' helper
// It will create refs for every reactive property.
// Only using state from the store but not calling any action.
// https://pinia.vuejs.org/core-concepts/#Destructuring-from-a-Store

import { storeToRefs } from "pinia";
const { products } = storeToRefs(productStore);

*/
</script>

<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton @click="undo">Redo</AppButton>
      <AppButton class="ml-2" @click="redo">Redo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <!-- using the special $event keyword to get the count emitted from the component
      https://v3.vuejs.org/guide/component-custom-events.html#event-names -->
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @add-to-cart="cartStore.addItem($event, product)"
      />
    </ul>
  </div>
</template>

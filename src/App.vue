<script setup>
import { useProductStore } from "@/stores/ProductStore";
import { useCartStore } from "@/stores/CartStore";

import TheHeader from "@/components/TheHeader.vue";
import AppButton from "@/components/AppButton.vue";
import ProductCard from "@/components/ProductCard.vue";

const productStore = useProductStore();
const cartStore = useCartStore();

// call the action as a method of the productStore
productStore.fetchProducts();

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
      <AppButton @click="cartStore.undo">Redo</AppButton>
      <AppButton class="ml-2" @click="cartStore.redo">Redo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <!-- https://vuejs.org/guide/essentials/event-handling.html#accessing-event-argument-in-inline-handlers -->
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @add-to-cart="cartStore.addItem($event, product)"
      />
    </ul>
  </div>
</template>

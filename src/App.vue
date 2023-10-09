<script setup>
import { useProductStore } from "@/stores/ProductStore";
import { useCartStore } from "@/stores/CartStore";

import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";

const productStore = useProductStore();
const cartStore = useCartStore();

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

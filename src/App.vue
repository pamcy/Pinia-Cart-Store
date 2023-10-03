<script setup>
import { useProductStore } from "@/stores/ProductStore";

import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";

const productStore = useProductStore();

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
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
      />
    </ul>
  </div>
</template>

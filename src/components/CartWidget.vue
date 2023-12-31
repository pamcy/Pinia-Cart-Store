<script setup>
// imports
import { useCartStore } from "@/stores/CartStore";
import { ref } from "vue";
import CartItem from "./CartItem.vue";

const cartStore = useCartStore();

// data
const active = ref(false);
</script>

<template>
  <div class="relative">
    <!-- Icon that always shows -->
    <span class="cursor-pointer" @click="active = true">
      <fa icon="shopping-cart" size="lg" class="text-gray-700" />
      <div class="cart-count absolute">{{ cartStore.totalCounts }}</div>
    </span>

    <!-- Modal Overlay only shows when cart is clicked on -->
    <AppModalOverlay :active="active" @close="active = false">
      <div v-if="!cartStore.isCartEmpty">
        <ul class="items-in-cart">
          <!-- v-for with an Object:
          https://vuejs.org/guide/essentials/event-handling.html#accessing-event-argument-in-inline-handlers -->
          <CartItem
            v-for="(items, name) in cartStore.groupedItems"
            :key="name"
            :product="items[0]"
            :count="cartStore.grouppedItemsWithCount(name)"
            @updateCount="cartStore.updateItemCount($event, items[0])"
            @remove-item="cartStore.removeItem(name)"
          />
        </ul>
        <div class="flex justify-end text-2xl mb-5">
          Total: <strong>$ {{ cartStore.totalPrice }}</strong>
        </div>
        <div class="flex justify-end">
          <!--
            $reset(): reset the state to its initial value

            this calls the state() function to create a new state object and replaces the current state with it.
          -->
          <AppButton class="secondary mr-2" @click="cartStore.clearCart"
            >Clear Cart</AppButton
          >
          <AppButton class="primary" @click="cartStore.goCheckout"
            >Checkout</AppButton
          >
        </div>
      </div>

      <div v-else><em>Cart is Empty</em></div>
    </AppModalOverlay>
  </div>
</template>

<style lang="pcss" scoped>
.items-in-cart{
  @apply mb-5;
}
.items-in-cart li{
  @apply flex justify-between p-2;
}
.items-in-cart li:nth-of-type(even){
  @apply bg-gray-300;
}
</style>

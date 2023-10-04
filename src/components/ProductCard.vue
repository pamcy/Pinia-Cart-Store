<script setup>
// imports
import { ref } from "vue";
import AppCountInput from "./AppCountInput.vue";

// props
const props = defineProps({
  product: Object,
});

// emits
defineEmits(["addToCart"]);

// data
const count = ref(0);
</script>

<template>
  <li class="card">
    <img :src="`/images/${product.image}`" class="mb-3" width="300" />
    <div>
      {{ product.name }} -
      <span class="text-green-500">${{ product.price }}</span>
      <div class="text-center m-4">
        <AppCountInput v-model="count" />
      </div>

      <!--
      (count = 0)
        - sets the value of the count variable to 0.
        - This statement is executed when the "Add to Cart" button is clicked, it resets the count variable to
        - equal to <button @click="count = 0">Add to Cart</button>
        - 可以將 emit 和 count = 0 兩個 function 寫在 Vue 中的 @click 事件裡
      -->
      <AppButton
        class="primary"
        @click="$emit('addToCart', count), (count = 0)"
      >
        Add to Cart
      </AppButton>
    </div>
  </li>
</template>

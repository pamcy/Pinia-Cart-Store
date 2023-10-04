import { defineStore } from "pinia";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
    };
  },
  actions: {
    addItemsToCart(count, item) {
      count = parseInt(count);

      for (let i = 0; i < count; i++) {
        this.items.push({
          // clone the product object to avoid mutating the original one
          ...item,
        });
      }
    },
  },
});

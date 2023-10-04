import { defineStore } from "pinia";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
    };
  },
  getters: {
    totalCounts: (state) => state.items.length,

    isCartEmpty: (state) => state.totalCounts === 0,

    /*
    // demo with regular function **

    totalCounts() {
      return this.items.length;
    },
    isCartEmpty() {
      return this.totalCounts === 0;
    },
    */
  },
  actions: {
    // actions 不能用 arrow function
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

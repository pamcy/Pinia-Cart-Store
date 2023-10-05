import { defineStore } from "pinia";

/**
 * A Pinia store for managing the shopping cart.
 */
export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
    };
  },
  getters: {
    /**
     * Returns the total number of items in the cart.
     * @param {Object} state - The current state of the store.
     * @returns {number} The total number of items in the cart.
     */
    totalCounts: (state) => state.items.length,

    /**
     * Returns whether the cart is empty or not.
     * @param {Object} state - The current state of the store.
     * @returns {boolean} Whether the cart is empty or not.
     */
    isCartEmpty: (state) => state.totalCounts === 0,

    /**
     * Returns an object with items grouped by their name.
     * @param {Object} state - The current state of the store.
     * @returns {Object} An object with items grouped by their name.
     */
    groupedItems: (state) => {
      return state.items.reduce((obj, item) => {
        // if the item name is not in the object, add it
        obj[item.name] = obj[item.name] || [];

        // otherwise, push the item to the existing array
        obj[item.name].push(item);

        return obj;

        // return obj data structure
        // {
        //   "Pineapple Gum": [
        //     {
        //       "name": "Pineapple Gum",
        //       "image": "pineapple-gum.jpg",
        //       "price": 3
        //     }
        //   ],
        //   "Dried Pineapple": [
        //     {
        //       "name": "Dried Pineapple",
        //       "image": "pineapple-dried.jpg",
        //       "price": 5
        //     }, {
        //       "name": "Dried Pineapple",
        //       "image": "pineapple-dried.jpg",
        //       "price": 5
        //     }
        //   ]
        // }
      }, {});
    },

    /**
     * @returns {Function} A function that takes an item name and returns the count of items with that name in the cart.
     */
    grouppedItemsWithCount: (state) => {
      // dynamic getter with return function
      // https://pinia.vuejs.org/core-concepts/getters.html#Passing-arguments-to-getters
      return (name) => state.groupedItems[name].length;
    },

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

    /**
     * Adds items to the cart.
     * @param {number} count - The number of items to add.
     * @param {Object} item - The item to add.
     */
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

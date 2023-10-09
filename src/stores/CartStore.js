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
      const groupped = state.items.reduce((obj, item) => {
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

      let sorted = {};

      // [ 'Dried Pineapple', 'Pineapple Gum']
      Object.keys(groupped)
        .sort()
        .forEach((key) => {
          sorted[key] = groupped[key];
        });

      return sorted;
    },

    /**
     * @returns {Function} A function that takes an item name and returns the count of items with that name in the cart.
     */
    grouppedItemsWithCount: (state) => {
      // dynamic getter with return function
      // https://pinia.vuejs.org/core-concepts/getters.html#Passing-arguments-to-getters
      return (name) => state.groupedItems[name].length;
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + item.price, 0);
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
    addItem(count, item) {
      count = parseInt(count);

      for (let i = 0; i < count; i++) {
        this.items.push({
          // clone the product object to avoid mutating the original one
          ...item,
        });
      }
    },
    /**
     * Removes an item from the cart by name.
     * @param {string} name - The name of the item to remove.
     */
    removeItem(name) {
      this.items = this.items.filter((item) => item.name !== name);
    },
    /**
     * Updates the item count for a given item in the cart.
     * @param {number} count - The new count for the item.
     * @param {object} item - The item to update.
     */
    updateItemCount(count, item) {
      count = parseInt(count);

      this.removeItem(item.name);
      this.addItem(count, item);
    },
  },
});

import { defineStore } from "pinia";

export const useProductStore = defineStore("ProductStore", {
  // * state
  // In Pinia the state is defined as a function that returns the initial state.
  // This allows Pinia to work in both Server and Client Side.
  state: () => {
    return {
      products: [],
    };
  },

  // * getters
  // as the computed properties

  // * actions
  // as the methods
  actions: {
    async fetchProducts() {
      // default 是 JSON 文件的預設匯出
      // https://javascript.info/modules-dynamic-imports
      this.products = (await import("@/data/products.json")).default;

      // demo with fetch api
      //   this.products = await fetch("https://fakestoreapi.com/products").then(
      //     (res) => res.json()
      //   );
    },
  },
});

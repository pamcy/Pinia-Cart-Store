import { defineStore } from "pinia";
import products from "@/data/products.json";

export const useProductStore = defineStore("ProductStore", {
  // * state
  // In Pinia the state is defined as a function that returns the initial state.
  // This allows Pinia to work in both Server and Client Side.
  state: () => {
    return {
      products,
    };
  },

  // * getters
  // * actions
});

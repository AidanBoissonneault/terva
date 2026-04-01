// loading store
// this store is started / stopped whenever the router is changed.
// making the screen enter a "Loading" state.
// LAST EDITED: 20MAR2026
// By: Aidan Boissonneault

import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isRouteLoading: false
  }),

  actions: {
    start() {
      this.isRouteLoading = true
    },

    stop() {
      this.isRouteLoading = false
    }
  }
})

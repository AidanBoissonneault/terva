import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
  state: () => ({
    message: 'An unexpected error occurred.',
    backRoute: 'dashboard' as string,
  }),

  actions: {
    set(message: string, backRoute = 'dashboard') {
      this.message = message
      this.backRoute = backRoute
    },

    clear() {
      this.message = 'An unexpected error occurred.'
      this.backRoute = 'dashboard'
    },
  },
})

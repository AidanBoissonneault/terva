import { defineStore } from 'pinia'
import { useToastStore } from './toast'

export const useErrorStore = defineStore('error', {
  state: () => ({
    message: 'An unexpected error occurred.',
    backRoute: 'dashboard' as string,
  }),

  actions: {
    set(message: string, backRoute = 'dashboard') {
      this.message = message
      this.backRoute = backRoute
      useToastStore().show(message, 'error')
    },

    clear() {
      this.message = 'An unexpected error occurred.'
      this.backRoute = 'dashboard'
    },
  },
})

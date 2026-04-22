import { defineStore } from 'pinia'

export type ToastType = 'success' | 'warning' | 'error'

export const useToastStore = defineStore('toast', {
  state: () => ({
    visible: false,
    message: '',
    type: 'success' as ToastType,
    _timer: null as ReturnType<typeof setTimeout> | null,
  }),

  actions: {
    show(message: string, type: ToastType = 'success') {
      if (this._timer) clearTimeout(this._timer)
      this.message = message
      this.type = type
      this.visible = true
      this._timer = setTimeout(() => this.hide(), 5000)
    },

    hide() {
      this.visible = false
      if (this._timer) {
        clearTimeout(this._timer)
        this._timer = null
      }
    },
  },
})

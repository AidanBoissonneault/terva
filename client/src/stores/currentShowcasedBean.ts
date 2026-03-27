import { defineStore } from 'pinia'
import { type Bean } from '@/types'

export const useCurrentBeanStore = defineStore('currentBean', {
	state: () => ({
		currentBean: <Bean>{}
	}),

	actions: {
		set(bean: Bean) {
			this.currentBean = bean
		},

		get() {
			return this.currentBean
		}
	}
})

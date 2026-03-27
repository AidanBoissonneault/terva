import { defineStore } from 'pinia'
import { type Bean } from '@/types'

const defaultBean: Bean = {
	name: "Error Loading Bean",
	variety: "Go back to dashboard and reload.",
	status: "finished",
	pri_hue: 0,
	sec_hue: 10,
	acc_hue: 20,
}

export const useCurrentBeanStore = defineStore('currentBean', {
	state: () => ({
		currentBean: defaultBean
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

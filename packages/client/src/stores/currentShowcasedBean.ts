// current bean store
// used to store the bean currently used for brewing.
// this is selected by clicking on a bean on the main menu,
// and uses local cache storage to persist across refreshes.
// LAST EDITED: 27MAR2026
// BY: Aidan Boissonneault

import { defineStore } from 'pinia'
import { type Bean } from '@terva/shared'

const defaultBean: Bean = {
	name: "Error Loading Bean",
	id: -1,
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
			localStorage.setItem('currentBean', JSON.stringify(bean))
		},

		get() {
			const storedBeanString = localStorage.getItem('currentBean')
			if (storedBeanString) {
				this.currentBean = JSON.parse(storedBeanString)
			}
			return this.currentBean
		},

		clear() {
			localStorage.removeItem('currentBean')
		}
	}
})

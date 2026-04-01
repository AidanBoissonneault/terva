// Current brew transfer
// Saves a brew for transitioning between /brew routes.
// this brew is half-constructed, and will be finished
// in the second screen before submitting a finished brew.
// CREATED: 29MAR2026
// By: Aidan Boissonneault

import { defineStore } from 'pinia'
import { type Brew } from '@terva/shared'

const defaultBrew = <Brew>{
	grindSize: 0,
    grinderId: -1,
    brewerId: -1,
    doseG: 0,
    yieldG: 0,
    recipeId: -1,
		closeness: "success"
}

const localStorageName = 'currentBrew'

export const useBrewTransferStore = defineStore('currentBrew', {
	state: () => ({
		currentBrew: defaultBrew
	}),

	actions: {
		set(brew: Brew) {
			this.currentBrew = brew
			localStorage.setItem(localStorageName, JSON.stringify(brew))
		},

		get() {
			const storedBrewString = localStorage.getItem(localStorageName)
			if (storedBrewString) {
				this.currentBrew = JSON.parse(storedBrewString)
			}
			return this.currentBrew
		},

		clear() {
			localStorage.removeItem(localStorageName)
		}
	}
})

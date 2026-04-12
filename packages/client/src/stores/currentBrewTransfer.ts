// Current brew transfer
// Saves a brew for transitioning between /brew routes.
// this brew is half-constructed, and will be finished
// in the second screen before submitting a finished brew.
// CREATED: 29MAR2026
// By: Aidan Boissonneault

import { defineStore } from 'pinia'
import { type Brew } from '@terva/shared'

const defaultBrew = <Brew>{}

const localStorageName = 'currentBrew'

export const useBrewTransferStore = defineStore('currentBrew', {
	state: () => ({
		currentBrew: defaultBrew,
	}),

	actions: {
		set(brew: Brew) {
			this.currentBrew = brew
			localStorage.setItem(localStorageName, JSON.stringify(brew))
		},

		get() {
			try {
				const storedBrewString = localStorage.getItem(localStorageName)
				if (storedBrewString) {
					const parsed = JSON.parse(storedBrewString)
					// basic shape check
					if (parsed && typeof parsed === 'object' && 'recipeId' in parsed) {
						this.currentBrew = parsed
					} else {
						localStorage.removeItem(localStorageName)
					}
				}
			} catch {
				localStorage.removeItem(localStorageName)
			}
			return this.currentBrew
		},

		clear() {
			localStorage.removeItem(localStorageName)
			this.currentBrew = defaultBrew
		},
	},
})

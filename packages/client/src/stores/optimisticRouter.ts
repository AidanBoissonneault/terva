// optimistic routing store
// used to pre-move visual elements before a route changes.

// 10APR2026
// By: Aidan Boissonneault

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useOptimisticRouterStore = defineStore('optimisticRouter', () => {
	const previousRoute = ref('')
	const currentRoute = ref('')

	function setRoute(name: string) {
			previousRoute.value = currentRoute.value
			currentRoute.value = name
	}

	return { previousRoute, currentRoute, setRoute }
})

// chroma calculator store
// this is used for getting the chroma for construction colours.
// I know that a pania store is overkill for the use case,
// but used pinia for practice in using it.
// LAST EDITED: 25MAR2026
// By: Aidan Boissonneault

import { defineStore } from "pinia";
import { type BeanState } from "@/types";

export const useChromaStore = defineStore('chromaCalculator', {
	state: () => ({
		FRESH_CHROMA: 0.23,
		FROZEN_CHROMA: 0.15,
		FINISHED_CHROMA: 0.05,
	}),

	actions: {
		getChroma(state: BeanState): number {
			switch (state) {
				case 'fresh':
					return this.FRESH_CHROMA
				case 'frozen':
					return this.FROZEN_CHROMA
				default:
					return this.FINISHED_CHROMA
			}
		}
	}
})

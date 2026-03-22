import { defineStore } from "pinia";
import { type BeanState } from "@/types";

export const useChromaStore = defineStore('chromaCalculator', {
	state: () => ({
		FRESH_CHROMA: 0.23,
		FROZEN_CHROMA: 0.15,
		FINISHED_CHROMA: 0.02,
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

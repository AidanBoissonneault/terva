// Add recipe API
// Submits a new recipe with steps to the database.
// CREATED: 11APR2026
// LAST EDITED: 13APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON, Recipe, StepType } from '@terva/shared'

export interface AddRecipeStepForm {
	type: StepType
	action?: string | null        // optional; blank = display type name
	duration?: number | null      // undefined for setup/grind
	waterG?: number | null        // bloom, pour, preheat only
}

export interface AddRecipeForm {
	name: string
	brewMethod: string
	defaultDoseG: number
	steps: AddRecipeStepForm[]
}

export const addRecipe = async (recipe: AddRecipeForm): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.post('/api/recipe', {
			name:         recipe.name,
			brewMethod:   recipe.brewMethod,
			defaultDoseG: recipe.defaultDoseG,
			steps:        recipe.steps,
		})

		return { success: true, payload: data as { id: number } }
	} catch (err) {
		return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
	}
}

export const getRecipes = async (): Promise<CheckedJSON<Recipe[]>> => {
	try {
		const { data } = await axios.get('/api/recipe')
		return { success: true, payload: data as Recipe[] }
	} catch (err) {
		return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
	}
}

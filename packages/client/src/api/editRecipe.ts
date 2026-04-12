// Edit recipe API
// Sends updated recipe name, brew method and steps to the server.
// CREATED: 12APR2026
// LAST EDITED: 12APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON } from '@terva/shared'
import type { AddRecipeForm } from '@/api/addRecipe'

export interface EditRecipeForm extends AddRecipeForm {
	id: number
}

export const editRecipe = async (recipe: EditRecipeForm): Promise<CheckedJSON<{ success: true }>> => {
	try {
		const { data } = await axios.put('/api/recipe', {
			id: recipe.id,
			name: recipe.name,
			brewMethod: recipe.brewMethod,
			steps: recipe.steps,
		})
		return {
			success: true,
			payload: data as { success: true },
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

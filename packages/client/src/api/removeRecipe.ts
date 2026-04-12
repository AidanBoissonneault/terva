// Remove recipe API
// Deletes a recipe (and its steps via CASCADE) by id.
// CREATED: 12APR2026
// LAST EDITED: 12APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON } from '@terva/shared'

export const removeRecipe = async (id: number): Promise<CheckedJSON<{ success: true }>> => {
	try {
		const { data } = await axios.delete('/api/recipe', {
			data: { id },
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

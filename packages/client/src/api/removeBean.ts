// Remove bean API
// Removes a bean by id.
// CREATED: 08APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON } from '@terva/shared'

export const removeBean = async (id: number): Promise<CheckedJSON<{ success: true }>> => {
	try {
		const { data } = await axios.delete(`/api/bean/${id}`)

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

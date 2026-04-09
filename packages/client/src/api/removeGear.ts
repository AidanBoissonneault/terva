// Remove gear api
// This takes in an id (primary key) and a user.
// Deletes the gear from the database.
// CREATED: 26MAR2026
// LAST EDITED: 26MAR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON } from '@terva/shared'

export const removeGear = async (
	id: number,
): Promise<CheckedJSON<{ success: true }>> => {
	try {
		const { data } = await axios.delete('/api/gear', {
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

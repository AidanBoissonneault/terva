// Add gear api
// This is used when gear is added in the gear menu,
// and submits the written gear into the database.
// LAST EDITED: 26MAR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON, Gear } from '@/types'

export const addGear = async (gear: Gear): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.post('/api/addgear', {
			...gear,
			user: 1,
		})

		return {
			success: true,
			payload: data as { id: number },
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

// Edit gear API
// Sends updated gear name, type and notes to the server.
// CREATED: 12APR2026
// LAST EDITED: 12APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON, Gear } from '@terva/shared'

export const editGear = async (gear: Gear): Promise<CheckedJSON<{ success: true }>> => {
	try {
		const { data } = await axios.put('/api/gear', {
			id: gear.id,
			name: gear.name,
			type: gear.type,
			notes: gear.notes,
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

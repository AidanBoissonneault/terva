// Seed demo data api call
// Called on registration if the user opts into sample data.
// CREATED: 05APR2026
// LAST EDITED: 05APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON } from '@terva/shared'

export const seedDemo = async (): Promise<CheckedJSON<{ ok: boolean }>> => {
	try {
		const { data } = await axios.post('/api/seeddemo')

		console.log("seeded successfully")
		return {
			success: true,
			payload: data as { ok: boolean },
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

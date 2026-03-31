// Add brew API
// Used after finished brew screen to submit
// the created bean to the backend via the
// "EndBrewDataForm".
// CREATED: 231AR2026
// LAST EDITED: 31MAR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { Brew, CheckedJSON } from '@/types'

export const addBrew = async (brew: Brew, user: number): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.post('/api/addbrew', {
			...brew,
			user: user,
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

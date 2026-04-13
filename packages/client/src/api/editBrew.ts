// Edit brew API
// Sends an updated brew to the server.
// CREATED: 13APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { Brew, CheckedJSON } from '@terva/shared'

export const editBrew = async (id: number, brew: Brew): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.put(`/api/brew/${id}`, { ...brew })

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

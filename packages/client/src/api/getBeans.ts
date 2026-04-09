// Get beans api
// This retrieves all relevant beans to the user
// from the database.
// CREATED: 26MAR2026
// LAST EDITED: 26MAR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { Bean, CheckedJSON } from '@terva/shared'

export const getBeans = async (): Promise<CheckedJSON<Bean[]>> => {
	try {
		const { data } = await axios.get('/api/bean')

		return {
			success: true,
			payload: data as Bean[],
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

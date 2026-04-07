// Get recent brews api
// This returns the top 2 relevant brews from the database,
// with some additional info for the quick-access buttons.

// CREATED: 06APR2026
// LAST EDITED: 06APR2026

import axios from 'axios'
import type { CheckedJSON, BrewWithRecipeName } from '@terva/shared'

export const getRecentBrews = async (beanId: number): Promise<CheckedJSON<BrewWithRecipeName[]>> => {
	try {

		const { data } = await axios.get('/api/getrecentbrews', { params: { beanId } })

		return {
			success: true,
			payload: data as BrewWithRecipeName[],
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

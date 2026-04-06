// Get brews api
// This returns all relevant brews from the database.
// CREATED: 06APR2026
// LAST EDITED: 06APR2026

import axios from 'axios'
import type { CheckedJSON, Brew } from '@terva/shared'

export const getBrews = async (beanId: number): Promise<CheckedJSON<Brew[]>> => {
	try {

		const { data } = await axios.get('/api/getbrews', { params: { beanId } })

		return {
			success: true,
			payload: data as Brew[],
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

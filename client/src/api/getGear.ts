// Get gear api
// This returns all relevant gear from the database.
// LAST EDITED: 26MAR2026

import axios from 'axios'
import type { CheckedJSON, Gear } from '@/types'

export const getGear = async (): Promise<CheckedJSON<Gear[]>> => {
	try {
		const { data } = await axios.get('/api/getgear')

		return {
			success: true,
			payload: data as Gear[],
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

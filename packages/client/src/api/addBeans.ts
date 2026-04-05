// Add beans API
// This is used to add a bean into the database.
// Its intended use is when a bean is submitted from the
// "Add Bean Form".
// CREATED: 25MAR2026
// LAST EDITED: 25MAR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { AddBeanForm, CheckedJSON } from '@terva/shared'

export const addBean = async (bean: AddBeanForm): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.post('/api/addbean', {
			...bean,
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

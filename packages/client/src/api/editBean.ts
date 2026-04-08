// Edit bean API
// Sends an updated bean form to the server.
// CREATED: 08APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { AddBeanForm, CheckedJSON } from '@terva/shared'

export const editBean = async (id: number, bean: AddBeanForm): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.put(`/api/editbean/${id}`, { ...bean })

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

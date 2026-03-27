import axios from 'axios'
import type { AddBeanForm, CheckedJSON } from '@/types'

export const addGear = async (bean: AddBeanForm): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.post('/api/addbean', {
			...bean,
			user: 1,
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

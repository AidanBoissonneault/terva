import axios from 'axios'
import type { CheckedJSON, Gear } from '@/types'

export const addGear = async (gear: Gear): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const { data } = await axios.post('/api/addgear', {
			...gear,
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

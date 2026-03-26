import axios from 'axios'
import type { CheckedJSON } from '@/types'

export const removeGear = async (
	id: number,
	user: number,
): Promise<CheckedJSON<{ success: true }>> => {
	try {
		const { data } = await axios.delete('/api/removegear', {
			data: { id, user },
		})

		return {
			success: true,
			payload: data as { success: true },
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

import axios from 'axios'
import type { Bean, CheckedJSON } from '@/types'

export const getBeans = async (): Promise<CheckedJSON<Bean[]>> => {
	try {
		const { data } = await axios.get('/api/getbeans')

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

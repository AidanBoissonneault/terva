import axios from 'axios'
import type { Brew, CheckedJSON } from '@terva/shared'

export type InProgressBrew = Brew & { beanName: string; beanRoaster: string | null }

export const getInProgressBrews = async (): Promise<CheckedJSON<InProgressBrew[]>> => {
	try {
		const { data } = await axios.get('/api/brew/inprogress')
		return { success: true, payload: data as InProgressBrew[] }
	} catch (err) {
		return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
	}
}

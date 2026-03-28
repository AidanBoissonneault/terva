import axios from 'axios'
import type { CheckedJSON, Gear, Recipe } from '@/types'

export const getBrewStartData = async (): Promise<CheckedJSON<{ gears: Gear[], recipes: Recipe[]}>> => {
	try {
		const userId = 1

		const [{ data: gear }, { data: recipes }] = await Promise.all([
			axios.get('/api/getgear', { params: { userId } }),
			axios.get('/api/getrecipes', { params: { userId } }),
		])

		return {
			success: true,
			payload: { gears: gear as Gear[], recipes: recipes as Recipe[] },
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

// get start brew data API
// gets the gear and recipes in one call
// used for the Start Brew screen.
// CREATED: 27MAR2026
// LAST EDITED: 27MAR2026
// By: Aidan Boissnneault

import axios from 'axios'
import type { CheckedJSON, Gear, Recipe } from '@terva/shared'

export const getBrewStartData = async (): Promise<CheckedJSON<{ gears: Gear[], recipes: Recipe[]}>> => {
	try {

		const [{ data: gear }, { data: recipes }] = await Promise.all([
			axios.get('/api/getgear'),
			axios.get('/api/getrecipes'),
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

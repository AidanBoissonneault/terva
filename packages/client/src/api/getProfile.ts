// Get Profile API
// Returns user info and brew stats for the profile screen.
// CREATED: 07APR2026
// By: Aidan Boissonneault

import axios from 'axios'
import type { CheckedJSON, UserProfile } from '@terva/shared'

export const getProfile = async (): Promise<CheckedJSON<UserProfile>> => {
	try {
		const { data } = await axios.get('/api/profile')

		return {
			success: true,
			payload: data as UserProfile,
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

export const deleteAccount = async (): Promise<CheckedJSON<{ success: boolean }>> => {
	try {
		const { data } = await axios.delete('/api/profile')

		return {
			success: true,
			payload: data,
		}
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error',
		}
	}
}

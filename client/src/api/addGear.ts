import type { CheckedJSON, Gear } from '@/types'

export const addGear = async (gear: Gear): Promise<CheckedJSON<{ id: number }>> => {
	try {
		const res = await fetch('/api/addgear', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...gear,
				user: 1,
			}),
		})

		if (!res.ok) throw new Error('Failed to add gear')

		const data = await res.json()

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

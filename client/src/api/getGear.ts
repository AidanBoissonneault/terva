import type { CheckedJSON, Gear } from "@/types"

export const getGear = async (): Promise<CheckedJSON<Gear[]>> => {
	try {
		const res = await fetch('/api/getgear')
		if (!res.ok) throw new Error('Failed to fetch gear')
		const data = await res.json()
		return(<CheckedJSON<Gear[]>>{ success: true, payload: data })
	} catch (err) {
		return({ success: false, error: err instanceof Error ? err.message : 'Unknown error' })
	}

}

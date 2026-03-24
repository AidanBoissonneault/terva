// ─────────────────────────────────────────
//  Bean Type
// ─────────────────────────────────────────
export interface Bean extends AddBeanForm {
	pri_hue?: number
	sec_hue?: number
	acc_hue?: number
}

// ─────────────────────────────────────────
//  Bean State
// ─────────────────────────────────────────

export type BeanState = "fresh" | "frozen" | "finished"

// ─────────────────────────────────────────
//  Bean Submit Form
// ─────────────────────────────────────────
export interface AddBeanForm {
	name: string
	roaster?: string
	origin?: string
	variety?: string
	process?: string
	elevation_m?: number
	roast_level?: number
	status: BeanState
	flavour_summary?: string
}

// ─────────────────────────────────────────
//  API sending type
// ─────────────────────────────────────────

export type CheckedJSON<T> =
  | {
		success: true
		payload: T
	} | {
		success: false
		error: string
	}

// ─────────────────────────────────────────
//  Tab Bar Button
// ─────────────────────────────────────────
export interface TabButton {
	icon: string
	text: string
	route: string
}

// ─────────────────────────────────────────
//  Gear
// ─────────────────────────────────────────

export interface Gear {
	name: string
	type: GearCategory
	notes?: string
}

export type GearCategory =
	| 'grinder'
	| 'kettle'
	| 'scale'
	| 'brewer'
	| 'espresso_machine'

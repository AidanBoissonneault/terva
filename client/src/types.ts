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
	id: number
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

// ─────────────────────────────────────────
//  Tab Link
// ─────────────────────────────────────────

export interface TabLinkType {
	icon: string
	name: string
	route: string
}

// ─────────────────────────────────────────
//  Brew
// ─────────────────────────────────────────

export interface Brew {
	grindSize: number
	grinderId: number
	brewerId: number
	doseG: number
	yieldG: number
	recipeId: number
}

/**
 * CREATE TABLE brews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  bean_id       INT NOT NULL,
  recipe_id     INT,
  brewer_id     INT,
  closeness     ENUM('success', 'close', 'miss') NOT NULL,
  profile       ENUM('bitter', 'sweet', 'sour', 'balanced'),
  body          ENUM('light', 'medium', 'heavy'),
  grinder_id    INT,
  grind_size    FLOAT,
  dose_g        FLOAT,
  yield_g       FLOAT,
  time_seconds  INT,
  notes         TEXT,
  brewed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bean_id)   REFERENCES beans(id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  FOREIGN KEY (brewer_id) REFERENCES gear(id),
  FOREIGN KEY (grinder_id) REFERENCES gear(id)
);
 */


// ─────────────────────────────────────────
//  Recipe
// ─────────────────────────────────────────

export interface Recipe {
	id: number
	name: string
	brewMethod: string
	steps: RecipeStep[]
}

export interface RecipeStep {
	id: number
	stepOrder: number
	action: string
	duration: number
}

/**
 * CREATE TABLE recipes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  brew_method  ENUM('pourover', 'espresso', 'aeropress', 'french_press', 'cold_brew', 'moka_pot', 'siphon', 'other') NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ordered steps within a recipe
CREATE TABLE recipe_steps (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id        INT NOT NULL,
  step_order       TINYINT NOT NULL,
  action           VARCHAR(100) NOT NULL,
  duration_seconds INT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
 */

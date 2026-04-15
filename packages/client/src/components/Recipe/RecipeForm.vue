<!--
Recipe Form
Collects name, brew method, default dose, and ordered steps.
Each step has a type chip selector plus optional action label,
conditional duration and water weight fields.

CREATED: 11APR2026
LAST EDITED: 13APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { AddRecipeForm, AddRecipeStepForm } from '@/api/addRecipe'
import { getGear } from '@/api/getGear'
import type { Gear, StepType } from '@terva/shared'

const BREW_METHODS = [
	'V60', 'Espresso', 'Aeropress', 'French Press',
	'Cold Brew', 'Moka Pot', 'Switch / Origami', 'Siphon', 'Other',
]

// Step type definitions - drives chips + conditional fields
interface StepTypeDef {
	type: StepType
	label: string
	hasDuration: boolean
	hasWater: boolean
	isTap: boolean  // tap-to-advance, no timer
}

const STEP_TYPES: StepTypeDef[] = [
	{ type: 'setup',    label: 'Setup',    hasDuration: false, hasWater: false, isTap: true  },
	{ type: 'grind',    label: 'Grind',    hasDuration: false, hasWater: false, isTap: true  },
	{ type: 'preheat',  label: 'Preheat',  hasDuration: true,  hasWater: true,  isTap: false },
	{ type: 'bloom',    label: 'Bloom',    hasDuration: true,  hasWater: true,  isTap: false },
	{ type: 'pour',     label: 'Pour',     hasDuration: true,  hasWater: true,  isTap: false },
	{ type: 'agitate',  label: 'Agitate',  hasDuration: true,  hasWater: false, isTap: false },
	{ type: 'drawdown', label: 'Drawdown', hasDuration: true,  hasWater: false, isTap: false },
	{ type: 'wait',     label: 'Wait',     hasDuration: true,  hasWater: false, isTap: false },
]

function defForType(t: StepType): StepTypeDef {
	return STEP_TYPES.find(d => d.type === t) ?? STEP_TYPES[7]!
}

const modelValue = defineModel<AddRecipeForm>({
	default: {
		name: '',
		brewMethod: 'V60',
		defaultDoseG: 15,
		steps: [{ type: 'pour', action: '', duration: 30, waterG: undefined }],
	},
})

function defaultStep(): AddRecipeStepForm {
	return { type: 'pour', action: '', duration: 30, waterG: undefined }
}

const emits = defineEmits<{ formSubmitted: [void] }>()

const form = ref(clone(modelValue.value))
const gear = ref<Gear[]>([])

const brewers          = computed(() => gear.value.filter(g => g.type === 'brewer'))
const espressoMachines = computed(() => gear.value.filter(g => g.type === 'espresso_machine'))

// Calculated yield = sum of all water_g on water-bearing steps
const calculatedYield = computed(() =>
	form.value.steps.reduce((sum, s) => sum + (s.waterG ?? 0), 0)
)

onMounted(async () => {
	const result = await getGear()
	if (result.success) gear.value = result.payload
})

function handleSubmit() {
	modelValue.value = clone(form.value)
	emits('formSubmitted')
}

watch(modelValue, () => { form.value = clone(modelValue.value) }, { deep: true })

function clone(obj: AddRecipeForm): AddRecipeForm {
	return JSON.parse(JSON.stringify(obj))
}

function addStep() {
	form.value.steps.push(defaultStep())
}

function removeStep(index: number) {
	if (form.value.steps.length > 1) form.value.steps.splice(index, 1)
}

function moveStep(index: number, direction: 'up' | 'down') {
	const steps = form.value.steps
	const target = direction === 'up' ? index - 1 : index + 1
	if (target < 0 || target >= steps.length) return
	;[steps[index], steps[target]] = [steps[target]!, steps[index]!]
}

function setStepType(step: AddRecipeStepForm, type: StepType) {
	step.type = type
	const def = defForType(type)
	// Clear fields that don't apply to this type
	if (def.isTap)      { step.duration = undefined }
	else if (!step.duration) { step.duration = 30 }
	if (!def.hasWater)  { step.waterG = undefined }
}

const isValid = () =>
	!!form.value.name.trim() &&
	form.value.defaultDoseG > 0 &&
	form.value.steps.length > 0
</script>

<template>
	<form @submit.prevent="handleSubmit">
		<!-- Name -->
		<label class="large">
			Name *
			<input type="text" v-model="form.name" placeholder="My V60 Recipe" required maxlength="100" />
		</label>

		<!-- Brew Method -->
		<label class="large">
			Brew Method
			<select v-model="form.brewMethod">
				<optgroup label="Methods">
					<option v-for="method in BREW_METHODS" :key="method" :value="method">{{ method }}</option>
				</optgroup>
				<optgroup v-if="brewers.length" label="Your Brewers">
					<option v-for="g in brewers" :key="g.id" :value="g.name">{{ g.name }}</option>
				</optgroup>
				<optgroup v-if="espressoMachines.length" label="Your Espresso Machines">
					<option v-for="g in espressoMachines" :key="g.id" :value="g.name">{{ g.name }}</option>
				</optgroup>
			</select>
		</label>

		<!-- Default Dose + calculated yield -->
		<div class="large dose-row">
			<label class="inline-label">
				<small>Default Dose (g)</small>
				<input type="number" v-model.number="form.defaultDoseG" required />
			</label>
			<div class="yield-display" v-if="calculatedYield > 0">
				<small class="muted">Yield</small>
				<span class="yield-value">{{ calculatedYield }}g</span>
			</div>
		</div>

		<!-- Steps -->
		<div class="large steps-section">
			<div v-for="(step, index) in form.steps" :key="index" class="step">
				<span class="step-number">{{ index + 1 }}</span>

				<div class="step-body">
					<!-- Type chip selector -->
					<div class="type-chips">
						<button
							v-for="def in STEP_TYPES"
							:key="def.type"
							type="button"
							class="type-chip"
							:class="{ active: step.type === def.type }"
							@click="setStepType(step, def.type)"
						>{{ def.label }}</button>
					</div>

					<!-- Optional action label -->
					<input
						type="text"
						v-model="step.action"
						:placeholder="defForType(step.type).label"
						maxlength="100"
					/>

					<!-- Conditional fields row -->
					<div class="step-fields" v-if="defForType(step.type).hasDuration || defForType(step.type).hasWater">
						<label class="inline-label" v-if="defForType(step.type).hasDuration">
							<small>Duration (s)</small>
							<input type="number" v-model.number="step.duration" min="1" max="3600" />
						</label>
						<label class="inline-label" v-if="defForType(step.type).hasWater">
							<small>Water (g)</small>
							<input type="number" v-model.number="step.waterG" min="0" max="9999" />
						</label>
					</div>
					<div class="tap-hint" v-else>
						<small class="muted">Tap to advance - no timer</small>
					</div>
				</div>

				<!-- Step reorder / remove -->
				<div class="step-controls">
					<button type="button" @click="moveStep(index, 'up')"  :disabled="index === 0">↑</button>
					<button type="button" @click="moveStep(index, 'down')" :disabled="index === form.steps.length - 1">↓</button>
					<button type="button" @click="removeStep(index)" :disabled="form.steps.length === 1" class="remove">✕</button>
				</div>
			</div>

			<button type="button" class="glass secondary add-step" @click="addStep">+ Add Step</button>
		</div>

		<button type="submit" :disabled="!isValid()" class="big-text glass">Save Recipe</button>
	</form>
</template>

<style scoped>
form { display: contents; }

label { grid-column: span 2; }
.large { grid-column: span 4; }

/* Dose row */
.dose-row {
	display: flex;
	align-items: flex-end;
	gap: 16px;
}

.inline-label {
	display: flex;
	flex-direction: column;
	gap: 4px;
	grid-column: unset;
}

.inline-label input {
	width: 90px;
	margin: 0;
	padding: 6px 10px;
}

.yield-display {
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding-bottom: 2px;
}

.yield-value {
	font-size: 1.1rem;
	font-weight: 600;
	color: var(--pico-primary);
}

.muted { color: var(--pico-muted-color); }

/* Steps */
.steps-section {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.step {
	display: flex;
	align-items: flex-start;
	gap: 10px;
	padding: 10px 12px;
	border-radius: var(--pico-border-radius);
	background-color: oklch(from var(--terva-app-bar) l c h / 0.3);
	border: 1px solid oklch(from var(--terva-app-bar-border) l c h / 0.18);
}

.step-number {
	font-size: 0.75rem;
	opacity: 0.4;
	font-weight: 600;
	padding-top: 10px;
	min-width: 16px;
	text-align: center;
}

.step-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

/* Type chips */
.type-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

.type-chip {
	padding: 3px 10px;
	border-radius: 999px;
	font-size: 0.72rem;
	font-weight: 500;
	border: 1px solid oklch(from var(--terva-app-bar-border) l c h / 0.3);
	background: oklch(from var(--terva-app-bar) l c h / 0.3);
	color: var(--pico-muted-color);
	box-shadow: none;
	cursor: pointer;
	transition: all 0.15s ease;
	line-height: 1.4;
}

.type-chip:hover {
	border-color: oklch(from var(--pico-primary) l c h / 0.5);
	color: var(--pico-color);
}

.type-chip.active {
	background: oklch(from var(--pico-primary) l c h / 0.18);
	border-color: oklch(from var(--pico-primary) l c h / 0.6);
	color: var(--pico-primary);
	font-weight: 600;
}

/* Action label input */
.step-body > input[type="text"] {
	margin: 0;
}

/* Duration / water row */
.step-fields {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.tap-hint {
	padding: 2px 0;
}

/* Step controls */
.step-controls {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding-top: 6px;
}

.step-controls button {
	width: 28px;
	height: 28px;
	padding: 0;
	font-size: 0.7rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: oklch(from var(--terva-app-bar) l c h / 0.4);
	border: 1px solid oklch(from var(--terva-app-bar-border) l c h / 0.2);
	border-radius: calc(var(--pico-border-radius) * 0.5);
	color: var(--terva-highlight);
	box-shadow: none;
}

.step-controls button:disabled { opacity: 0.2; }
.step-controls button.remove { color: var(--red-400); }
.step-controls button.remove:disabled { color: var(--pico-color); }

.add-step { width: 100%; font-size: 0.9rem; }
button[type='submit'] { grid-column: span 4; }
</style>

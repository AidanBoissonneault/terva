<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { AddRecipeForm } from '@/api/addRecipe'
import { getGear } from '@/api/getGear'
import type { Gear } from '@terva/shared'

const BREW_METHODS = [
	'V60',
	'Espresso',
	'Aeropress',
	'French Press',
	'Cold Brew',
	'Moka Pot',
	'Switch / Origami',
	'Siphon',
	'Other',
]

const modelValue = defineModel<AddRecipeForm>({
	default: {
		name: '',
		brewMethod: 'V60',
		steps: [{ action: '', duration: 30 }],
	},
})

const emits = defineEmits<{
	formSubmitted: [void]
}>()

const form = ref(clone(modelValue.value))
const gear = ref<Gear[]>([])

const brewers = computed(() => gear.value.filter((g) => g.type === 'brewer'))
const espressoMachines = computed(() => gear.value.filter((g) => g.type === 'espresso_machine'))

onMounted(async () => {
	const result = await getGear()
	if (result.success) gear.value = result.payload
})

function handleSubmit() {
	modelValue.value = clone(form.value)
	emits('formSubmitted')
}

watch(
	modelValue,
	() => {
		form.value = clone(modelValue.value)
	},
	{ deep: true },
)

function clone(obj: AddRecipeForm): AddRecipeForm {
	return JSON.parse(JSON.stringify(obj))
}

function addStep() {
	form.value.steps.push({ action: '', duration: 30 })
}

function removeStep(index: number) {
	if (form.value.steps.length > 1) {
		form.value.steps.splice(index, 1)
	}
}

function moveStep(index: number, direction: 'up' | 'down') {
	const steps = form.value.steps
	const target = direction === 'up' ? index - 1 : index + 1
	if (target < 0 || target >= steps.length) return
	;[steps[index], steps[target]] = [steps[target]!, steps[index]!]
}

const isValid = () =>
	!!form.value.name.trim() && form.value.steps.every((s) => !!s.action.trim() && s.duration > 0)
</script>

<template>
	<form @submit.prevent="handleSubmit">
		<label class="large">
			Name *
			<input type="text" v-model="form.name" placeholder="My V60 Recipe" required maxlength="100" />
		</label>

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

		<div class="large steps-section">
			<div v-for="(step, index) in form.steps" :key="index" class="step">
				<span class="step-number">{{ index + 1 }}</span>

				<div class="step-body">
					<input
						type="text"
						v-model="step.action"
						placeholder="e.g. Bloom — pour 2× dose weight, swirl"
						maxlength="100"
						required
					/>
					<label class="duration-label">
						Duration (seconds)
						<input type="number" v-model.number="step.duration" min="1" max="3600" />
					</label>
				</div>

				<div class="step-controls">
					<button type="button" @click="moveStep(index, 'up')" :disabled="index === 0">↑</button>
					<button
						type="button"
						@click="moveStep(index, 'down')"
						:disabled="index === form.steps.length - 1"
					>
						↓
					</button>
					<button
						type="button"
						@click="removeStep(index)"
						:disabled="form.steps.length === 1"
						class="remove"
					>
						✕
					</button>
				</div>
			</div>

			<button type="button" class="glass secondary add-step" @click="addStep">+ Add Step</button>
		</div>

		<button type="submit" :disabled="!isValid()" class="big-text glass">Save Recipe</button>
	</form>
</template>

<style scoped>
form {
	display: contents;
}

label {
	grid-column: span 2;
}

.large {
	grid-column: span 4;
}

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
	grid-column: span 4;
}

.step-number {
	font-size: 0.75rem;
	opacity: 0.4;
	font-weight: 600;
	padding-top: 12px;
	min-width: 16px;
	text-align: center;
}

.step-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.step-body input {
	margin: 0;
}

.duration-label {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 0.8rem;
	opacity: 0.65;
	grid-column: unset;
}

.duration-label input {
	width: 80px;
	margin: 0;
	padding: 4px 8px;
}

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

.step-controls button:disabled {
	opacity: 0.2;
}

.step-controls button.remove {
	color: var(--red-400);
}

.step-controls button.remove:disabled {
	color: var(--pico-color);
}

.add-step {
	width: 100%;
	font-size: 0.9rem;
}

button[type='submit'] {
	grid-column: span 4;
}
</style>

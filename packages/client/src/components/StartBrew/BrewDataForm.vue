<!--
Brew Data Form
This is used to collect data to start a brew in the /brew/start menu.
It outputs a form via v-model, and is submitted when a form-submmited event
is received.

CREATED: 27MAR2026
LAST EDITED: 12APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import type { Brew, Gear, Recipe } from '@terva/shared'
import { watch, ref } from 'vue'
import BrewDataBar from './BrewDataBar.vue'
import RecipeStepsChart from './RecipeStepsChart.vue'
import SectionSeperator from '../Utils/SectionSeperator.vue'

const modelValue = defineModel<Brew>({
	default: {
		grindSize: 0,
		grinderId: 0,
		doseG: 0,
		yieldG: 0,
		recipeId: 0,
		brewerId: 0,
		closeness: 'success',
		status: 'in_progress',
	},
})

const emits = defineEmits<{
	formSubmitted: [void]
}>()

const props = defineProps<{
	grinders: Gear[]
	brewers: Gear[]
	recipes: Recipe[]
}>()

const showRecipeSteps = ref(false)

// clone the modelValue to local data
// and provide a fallback user if none provided
const form = ref(clone(modelValue.value))

// only update the modelValue when the form is submitted
function handleSubmit() {
	modelValue.value = clone(form.value)
	emits('formSubmitted')
}

// reset form when prop changes
watch(
	modelValue,
	(newVal) => {
		if (JSON.stringify(newVal) !== JSON.stringify(form.value)) {
			form.value = clone(newVal)
		}
	},
	{ deep: true },
)

function clone(obj: Brew) {
	return JSON.parse(JSON.stringify(obj))
}

watch(
	() => props.grinders,
	(newVal) => {
		if (newVal?.length && form.value.grinderId === 0) {
			form.value.grinderId = newVal[0]?.id
		}
	},
	{ immediate: true },
)

watch(
	() => props.recipes,
	(newVal) => {
		if (newVal?.length && form.value.recipeId === 0) {
			form.value.recipeId = newVal[0]?.id
		}
	},
	{ immediate: true },
)

// Pre-populate dose from the selected recipe's defaultDoseG.
// Updates whenever the recipe selection changes so switching recipes
// always reflects the new recipe's default dose.
watch(
	() => form.value.recipeId,
	(newId) => {
		if (!newId) return
		const recipe = props.recipes.find((r) => r.id === newId)
		if (recipe?.defaultDoseG) {
			form.value.doseG = recipe.defaultDoseG
		}
		if (recipe?.steps) {
			form.value.yieldG = recipe.steps.reduce((acc, s) => acc + (s.waterG ?? 0), 0)
		}
	},
	{ immediate: true },
)

watch(
	() => props.brewers,
	(newVal) => {
		if (newVal?.length && form.value.brewerId === 0) {
			form.value.brewerId = newVal[0]?.id
		}
	},
	{ immediate: true },
)

watch(
	() => form.value.grinderId,
	(newVal) => {
		if (newVal === -1) {
			form.value.grindSize = 0
		}
	},
)
</script>

<template>
	<form @submit.prevent="handleSubmit">
		<!--Grinder-->
		<div class="row grinder">
			<label class="large">
				<small>Grinder</small>
				<select v-model="form.grinderId">
					<option v-for="grinder in grinders" :key="grinder.name" :value="grinder.id">
						{{ grinder.name }}
					</option>
					<option :value="null">Pre-ground</option>
				</select>
			</label>
			<label class="small">
				<small>Grind Size</small>
				<input
					type="number"
					v-model="form.grindSize"
					min="0"
					max="999"
					:disabled="form.grinderId === null"
				/>
			</label>
		</div>

		<!--Brewer-->
		<label>
			Brewer
			<select v-model="form.brewerId">
				<option v-for="brewer in brewers" :key="brewer.name" :value="brewer.id">
					{{ brewer.name }}
				</option>
			</select>
		</label>

		<!--Recipe-->
		<label>
			<div @click.stop class="space-between">
				<span>Recipe</span>
				<div class="recipe-links">
					<a href="#" @click.prevent="showRecipeSteps = !showRecipeSteps"
						>{{ showRecipeSteps ? 'Hide' : 'Show' }} Steps</a
					>
				</div>
			</div>
			<select v-model="form.recipeId">
				<option v-for="recipe in recipes" :key="recipe.name" :value="recipe.id">
					{{ recipe.name }}
				</option>
			</select>
		</label>

		<Transition name="grow" mode="out-in">
			<div v-if="showRecipeSteps && recipes.length" class="row card">
				<RecipeStepsChart :recipe="recipes.find((r) => r.id === form.recipeId) || recipes[0]!" />
			</div>
		</Transition>

		<SectionSeperator />
		<!--Dose / Ratio / Yield-->
		<BrewDataBar v-model="form" />

		<SectionSeperator />
		<button type="submit" class="big-text glass">Brew</button>
	</form>
</template>

<style scoped>
button {
	grid-column: span 4;
}

form {
	display: contents;
	grid-column: span 4;
}

label {
	grid-column: span 2;
}

label.centered {
	display: flex;
	flex-direction: column;
	align-items: center;
}

label.large {
	grid-column: span 4;
}

.row {
	grid-column: span 4;
}

.row.grinder {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
}

label.large {
	grid-column: span 3;
}

label.small {
	grid-column: span 1;
}

.space-between {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.recipe-links {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 0.875em;
}

.card {
	border-radius: var(--pico-border-radius);
	background: var(--pico-form-element-background-color);
	box-shadow: 0 2px 4px oklch(from var(--terva-shadow) calc(l - 1) c h / 0.6);
	padding: 16px;
}

.grow-enter-active,
.grow-leave-active {
	transition: all 0.3s ease-out;
	overflow: hidden;
}

.grow-enter-from {
	opacity: 0;
	max-height: 0;
}

.grow-enter-to {
	opacity: 1;
	max-height: 500px;
}

.grow-leave-from {
	opacity: 1;
	max-height: 500px;
}

.grow-leave-to {
	opacity: 0;
	max-height: 0;
}
</style>

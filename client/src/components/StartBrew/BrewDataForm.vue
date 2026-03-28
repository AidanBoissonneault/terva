<!--
Brew Data Form
This is used to collect data to start a brew in the /brew/start menu.
It outputs a form via v-model, and is submitted when a form-submmited event
is received.

CREATED: 27MAR2026
LAST EDITED: 28MAR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import type { Brew, Gear, Recipe } from '@/types';
import { watch, ref } from 'vue'
import BrewDataBar from './BrewDataBar.vue';

const modelValue = defineModel<Brew>({
	default: {
		grindSize: 0,
		grinderId: 0,
		doseG: 0,
		yieldG: 0,
		recipeId: 0,
		brewerId: 0,
	}
})

const emits = defineEmits<{
	formSubmitted: [ void ]
}>()

const props = defineProps<{
	grinders: Gear[]
	brewers: Gear[]
	recipes: Recipe[]
}>()

// clone the modelValue to local data
// and provide a fallback user if none provided
const form = ref(clone(modelValue.value))

// only update the modelValue when the form is submitted
function handleSubmit() {
	modelValue.value = clone(form.value)
	emits('formSubmitted')
}

// reset form when prop changes
watch(modelValue, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(form.value)) {
    form.value = clone(newVal)
  }
}, { deep: true })

function clone(obj: Brew) {
	return JSON.parse(JSON.stringify(obj))
}

watch(() => form.value.grinderId, (newVal) => {
  if (newVal === -1) {
    form.value.grindSize = 0
  }
})

watch(() => props.grinders, (newVal) => {
  if (newVal?.length && form.value.grinderId === 0) {
    form.value.grinderId = newVal[0]?.id
  }
}, { immediate: true })

watch(() => props.recipes, (newVal) => {
	if (newVal?.length && form.value.recipeId === 0) {
		form.value.recipeId = newVal[0]?.id
	}
}, { immediate: true })

watch(() => props.brewers, (newVal) => {
	if (newVal?.length && form.value.brewerId === 0) {
		form.value.brewerId = newVal[0]?.id
	}
}, { immediate: true })
</script>

<template>
	<form @submit.prevent="handleSubmit">

		<!--Grinder-->
		<div class="row grinder">
			<label class="large">
				<small>Grinder</small>
				<select v-model="form.grinderId" required>
					<option v-for="grinder in grinders" :key="grinder.name" :value="grinder.id">{{ grinder.name }}</option>
					<option :value="-1">Pre-ground</option>
				</select>
			</label>
			<label class="small">
				<small>Grind Size</small>
				<input type="number" v-model="form.grindSize" min="0" max="999" :disabled="form.grinderId === -1">
			</label>
		</div>

			<!--Brewer-->
			<label>
				Brewer
				<select v-model="form.brewerId" required>
					<option v-for="brewer in brewers" :key="brewer.name" :value="brewer.id">{{ brewer.name }}</option>
				</select>
			</label>

			<!--Recipe-->
			<label>
				Recipe
				<select v-model="form.recipeId" required>
					<option v-for="recipe in recipes" :key="recipe.name" :value="recipe.id">{{ recipe.name }}</option>
				</select>
			</label>

		<!--Dose / Ratio / Yield-->
		<BrewDataBar v-model="form"/>
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
	color: var(--husk-shadow);
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
</style>

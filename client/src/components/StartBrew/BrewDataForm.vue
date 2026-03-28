<!--
Brew Data Form
This is used to collect data to start a brew in the /brew/start menu.
It outputs a form via v-model, and is submitted when a form-submmited event
is received.

CREATED: 27MAR2026
LAST EDITED: 27MAR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import type { Brew } from '@/types';
import { watch, ref } from 'vue'
import BrewDataBar from './BrewDataBar.vue';

const modelValue = defineModel<Brew>({
	default: {
		grindSize: 0,
		grinderId: 0,
		doseG: 0,
		yieldG: 0,
		recipeId: 0,
	}
})

const emits = defineEmits<{
	formSubmitted: [ void ]
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
</script>

<template>
	<form @submit.prevent="handleSubmit">
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

.seperated {
	display: flex;
	justify-content: space-between;
	width: 100%;
}
</style>

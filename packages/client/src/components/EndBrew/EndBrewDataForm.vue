<!--
End Brew Data Form
This is used to collect data at the end of a brew on how the brew went.
It completes the form created in the start brew form.

CREATED: 30MAR2026
LAST EDITED: 30MAR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import type { Brew } from '@terva/shared';
import { watch, ref, onMounted } from 'vue';

const modelValue = defineModel<Brew>({
	default: {
		grindSize: 0,
		grinderId: 0,
		doseG: 0,
		yieldG: 0,
		recipeId: 0,
		brewerId: 0,
		notes: "",
	}
})

const emits = defineEmits<{
	formSubmitted: [void]
}>()

const props = defineProps<{
	importForm: Brew
}>()


// clone the modelValue to local data
// and provide a fallback user if none provided
const form = ref<Brew>(clone(modelValue.value))

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

onMounted(() => {
	form.value = props.importForm
	console.log(form.value)
})
</script>

<template>
	<form @submit.prevent="handleSubmit">

		<label class="large">
			<small>How was your brew?</small>
			<div class="closeness-button-container">
				<button @click="form.closeness = 'success'" :class=" { contrast: form.closeness === 'success' }" class="glass" type="button">Success</button>
				<button @click="form.closeness = 'close'" :class=" { contrast: form.closeness === 'close' }" class="glass" type="button">Close</button>
				<button @click="form.closeness = 'miss'" :class=" { contrast: form.closeness === 'miss' }" class="glass" type="button">Miss</button>
			</div>
		</label>

		<label class="large">
			<div class="space-between">
				<small>Bitter</small>
				<small>Balanced</small>
				<small>Sour</small>
			</div>
			<input type="range" v-model="form.profile">
		</label>

		<label class="large">
			<div class="space-between">
				<small>Light</small>
				<small>Medium</small>
				<small>Heavy</small>
			</div>
			<input type="range" v-model="form.body">
		</label>

		<label class="large notes-label">
			<small>Notes</small>
			<textarea rows="4" placeholder="Tell us about your brew." maxlength="500" v-model="form.notes"></textarea>
		</label>

		<button type="submit" class="big-text glass">End Brew</button>
	</form>
</template>

<style scoped>
button[type="submit"] {
	grid-column: span 4;
}

form {
	display: contents;
	grid-column: span 4;
}

form > * {
	margin-top: 0;
	margin-bottom: 0;
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

.notes-label {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.notes-label textarea {
	width: 100%;
	box-sizing: border-box;
}

.space-between {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.closeness-button-container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 16px;
}
</style>

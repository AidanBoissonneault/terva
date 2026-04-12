<script setup lang="ts">
import type { Gear, GearCategory } from '@terva/shared'
import { watch, ref } from 'vue'

const props = defineProps<{
	gearList: GearCategory[]
	selectedType: GearCategory
}>()

const modelValue = defineModel<Gear>({
	default: {
		name: undefined,
		type: "grinder",
		notes: undefined
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
watch(modelValue, () => {
	form.value = clone(modelValue.value)
}, { deep: true })

watch(
  () => props.selectedType,
  (newType) => {
    form.value.type = newType
  },
  { immediate: true }
)


function clone(obj: Gear) {
	return JSON.parse(JSON.stringify(obj))
}
</script>

<template>
	<form @submit.prevent="handleSubmit">
		<label>
			Category
			<select v-model="form.type" @keydown.space.stop>
				<option v-for="type in gearList" :key="type" :value="type">{{ type.charAt(0).toUpperCase() + type.slice(1) }}</option>
			</select>
		</label>
		<label>
			Name
			<input type="text" placeholder="Hario V60 02" v-model="form.name" maxlength="99">
		</label>
		<label>
			Notes
			<textarea placeholder="Additional Notes" v-model="form.notes" maxlength="100"></textarea>
		</label>
		<button type="submit" :disabled="! !!form.name?.trim()" class="big-text glass">Add Gear</button>
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
	color: var(--terva-shadow);
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

<!--
Brew Data Bar
used to display a reactive component for getting
dose, ratio, and yield
on the Brew Data Form component.
CREATED: 27MAR2026
LAST EDITED: 06APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Brew } from '@terva/shared'

const form = defineModel<Brew>({
	default: {
		grindSize: 0,
		grinderId: 0,
		doseG: 0,
		yieldG: 0,
		ratio: 15,
		recipeId: 0,
	}
})

// Ratio is the source of truth - not derived from yieldG/doseG
const ratio = ref(
	form.value.doseG && form.value.yieldG
		? Math.round(form.value.yieldG / form.value.doseG)
		: 16
)

// Water always = dose × ratio, kept in sync on every change
const water = computed({
	get() {
		return form.value.doseG ? Math.round(form.value.doseG * ratio.value) : form.value.yieldG
	},
	set(val: number) {
		if (isNaN(val) || val <= 0) return
		if (form.value.doseG) {
			ratio.value = Math.round(val / form.value.doseG)
		}
		form.value = { ...form.value, yieldG: val }
	}
})

// Watch for ratio changes from import on quick start brew
watch(() => [form.value.doseG, form.value.yieldG], ([dose, yield_]) => {
    if (dose && yield_) {
        ratio.value = Math.round(yield_ / dose)
    }
}, { immediate: false })

function onDoseChange(val: number) {
	if (isNaN(val)) return
	form.value = {
		...form.value,
		doseG: val,
		yieldG: val ? Math.round(val * ratio.value) : form.value.yieldG
	}
}

function onRatioChange(val: number) {
	if (isNaN(val) || val <= 0) return
	ratio.value = val
	form.value = {
		...form.value,
		yieldG: form.value.doseG ? Math.round(form.value.doseG * val) : form.value.yieldG
	}
}
</script>

<template>
	<div class="brew-bar">
		<div class="field">
			<label>Dose</label>
			<input type="number" :value="form.doseG"
				@input="onDoseChange(Number(($event.target as HTMLInputElement).value))" />
		</div>

		<div class="field">
			<label>Ratio</label>
			<div class="ratio-group">
				<input type="number" :value="1" disabled />
				<span>/</span>
				<input type="number" :value="ratio" @input="onRatioChange(Number(($event.target as HTMLInputElement).value))" />
			</div>
		</div>

		<div class="field">
			<label>Water</label>
			<input type="number" v-model.number="water" />
		</div>
	</div>
</template>

<style scoped>
.brew-bar {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	padding: 0.75rem 1rem;
	border-radius: var(--pico-border-radius);

	background: var(--pico-form-element-background-color);

	box-shadow: 0 2px 4px oklch(from var(--husk-shadow) calc(l - 1) c h / 0.6);

	align-items: flex-end;

	width: 100%;
	grid-column: span 4;
}

.field {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	gap: 0.25rem;
	font-size: 0.85rem;
}

.field label {
	opacity: 0.9;
}

.field input {
	height: 1.6rem;
	padding: 0 0.4rem;
	border-radius: 0.4rem;
	border: none;

	background: var(--husk-tab-bar);
	color: var(--husk-shadow);

	font-size: 0.85rem;
	max-width: 4.5rem;
}

.ratio-group {
	display: flex;
	align-items: center;
	gap: 0.35rem;
}

.ratio-group input {
	max-width: 3.2rem;
	text-align: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

input[type="number"] {
	appearance: textfield;
	-moz-appearance: textfield;
}
</style>

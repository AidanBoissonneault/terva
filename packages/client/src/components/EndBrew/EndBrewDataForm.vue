<!--
End Brew Data Form
This is used to collect data at the end of a brew on how the brew went.
It completes the form created in the start brew form.

CREATED: 30MAR2026
LAST EDITED: 15APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import type { Brew } from '@terva/shared'
import { watch, ref, onMounted } from 'vue'

const modelValue = defineModel<Brew>({
	default: {
		grindSize: 0,
		grinderId: 0,
		doseG: 0,
		yieldG: 0,
		recipeId: 0,
		brewerId: 0,
		notes: '',
	},
})

const emits = defineEmits<{
	formSubmitted: [void]
}>()

const props = defineProps<{
	importForm: Brew
}>()

const form = ref<Brew>(clone(modelValue.value))

function handleSubmit(): void {
	modelValue.value = clone(form.value)
	emits('formSubmitted')
}

watch(
	modelValue,
	(newVal) => {
		if (JSON.stringify(newVal) !== JSON.stringify(form.value)) {
			form.value = clone(newVal)
		}
	},
	{ deep: true },
)

function clone(obj: Brew): Brew {
	return JSON.parse(JSON.stringify(obj))
}

onMounted(() => {
	form.value = props.importForm
})

/* slider */

const pad = ref<HTMLElement | null>(null)

/* ---------- HAPTICS ---------- */

function haptic(type: 'light' | 'medium' | 'heavy' = 'light'): void {
	if ('vibrate' in navigator) {
		navigator.vibrate(type === 'heavy' ? 20 : type === 'medium' ? 12 : 6)
	}
}

function updateTarget(clientX: number, clientY: number): void {
	if (!pad.value) return

	const rect = pad.value.getBoundingClientRect()

	let x = ((clientX - rect.left) / rect.width) * 100
	let y = ((clientY - rect.top) / rect.height) * 100

	x = Math.max(0, Math.min(100, x))
	y = Math.max(0, Math.min(100, y))

	form.value.profile = Math.round(x)
	form.value.body = Math.round(100 - y)
}

/* ---------- EVENT HELPERS ---------- */

function getPointFromEvent(ev: MouseEvent | TouchEvent): { x: number; y: number } | null {
	if (ev instanceof TouchEvent) {
		const touch = ev.touches[0]
		if (!touch) return null
		return { x: touch.clientX, y: touch.clientY }
	} else {
		return { x: ev.clientX, y: ev.clientY }
	}
}

/* ---------- DRAG ---------- */

function startDrag(e: MouseEvent | TouchEvent): void {
	haptic('light')

	const move = (ev: MouseEvent | TouchEvent): void => {
		const point = getPointFromEvent(ev)
		if (!point) return
		updateTarget(point.x, point.y)
	}

	const stop = (): void => {
		window.removeEventListener('mousemove', move)
		window.removeEventListener('mouseup', stop)
		window.removeEventListener('touchmove', move)
		window.removeEventListener('touchend', stop)
	}

	window.addEventListener('mousemove', move)
	window.addEventListener('mouseup', stop)
	window.addEventListener('touchmove', move)
	window.addEventListener('touchend', stop)

	const startPoint = getPointFromEvent(e)
	if (startPoint) updateTarget(startPoint.x, startPoint.y)
}
</script>

<template>
	<form @submit.prevent="handleSubmit">
		<label class="large">
			<small>How was your brew?</small>
			<div class="closeness-button-container">
				<button
					@click="form.closeness = 'success'"
					:class="{ contrast: form.closeness === 'success' }"
					class="glass"
					type="button"
				>
					Success
				</button>
				<button
					@click="form.closeness = 'close'"
					:class="{ contrast: form.closeness === 'close' }"
					class="glass"
					type="button"
				>
					Close
				</button>
				<button
					@click="form.closeness = 'miss'"
					:class="{ contrast: form.closeness === 'miss' }"
					class="glass"
					type="button"
				>
					Miss
				</button>
			</div>
		</label>

		<label class="large">
			<small>Flavor & Body</small>

			<div class="two-d-slider" ref="pad" @mousedown="startDrag" @touchstart.prevent="startDrag">
				<div class="grid"></div>

				<div class="axis x">
					<small>Bitter</small>
					<small>Balanced</small>
					<small>Sour</small>
				</div>

				<div class="axis y">
					<small>Light</small>
					<small>Medium</small>
					<small>Heavy</small>
				</div>

				<div
					class="point"
					:style="{
						left: `${form.profile}%`,
						top: `${100 - form.body!}%`,
					}"
				/>
			</div>
		</label>

		<textarea
			cols="30"
			rows="4"
			placeholder="Tell us about your brew."
			maxlength="500"
			v-model="form.notes"
		></textarea>

		<button type="submit" class="big-text glass">End Brew</button>
	</form>
</template>

<style scoped>
button[type='submit'] {
	grid-column: span 4;
}

form {
	display: contents;
	grid-column: span 4;
}

form > * {
	margin-top: 16px;
	margin-bottom: 16px;
}

label {
	grid-column: span 2;
}

label.large {
	grid-column: span 4;
}

.closeness-button-container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 16px;
}

/* ---------- 2D SLIDER (SMALLER) ---------- */

.two-d-slider {
	position: relative;
	width: 100%;
	max-width: 220px;
	margin: 0 auto;
	aspect-ratio: 1 / 1;
	border-radius: 16px;
	background: var(--pico-muted-background);
	touch-action: none;
}

.grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
		linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
	background-size: 33.33% 33.33%;
}

.grid::after {
	content: '';
	position: absolute;
	inset: 0;
	background:
		linear-gradient(to right, transparent 49.5%, rgba(255, 255, 255, 0.12) 50%, transparent 50.5%),
		linear-gradient(to bottom, transparent 49.5%, rgba(255, 255, 255, 0.12) 50%, transparent 50.5%);
}

.point {
	position: absolute;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--pico-primary);
	transform: translate(-50%, -50%);
	pointer-events: none;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.axis {
	position: absolute;
	display: flex;
	font-size: 0.65rem;
	opacity: 0.7;
	pointer-events: none;
}

.axis.x {
	bottom: 6px;
	left: 20px;
	right: 6px;
	justify-content: space-between;
}

.axis.y {
	top: 6px;
	bottom: 20px;
	left: 6px;
	flex-direction: column;
	justify-content: space-between;
}
</style>

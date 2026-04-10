<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Bean } from '@terva/shared';
import { useChromaStore } from '@/stores/chromaCalculator';

const props = defineProps<{
	bean: Bean
}>()

const emits = defineEmits<{
	clicked: [Bean]
}>()

const lightness = ref(0.7) // fallback default

// reset lightness if possible
onMounted(() => {
	lightness.value = Number(getComputedStyle(document.documentElement)
		.getPropertyValue('--lightness')
		.trim())
})

// get chroma store and calculate
const chromaCalculator = useChromaStore()
const chroma = ref(chromaCalculator.getChroma(props.bean.state))

// calculate colors
const priColor = computed(() =>
	`oklch(${lightness.value - 0.02} ${chroma.value} ${props.bean.pri_hue})`
)
const secColor = computed(() =>
	`oklch(${lightness.value + 0.04} ${chroma.value} ${props.bean.sec_hue})`
)
const accColor = computed(() =>
	`oklch(${lightness.value + 0.08} ${chroma.value} ${props.bean.acc_hue})`
)

// calculate elevation from 0-1 to use as a scale for calculating positions in colours
const elevationNorm = computed(() => {
	const raw = props.bean.elevationM

	if (!raw) return 0

	// sanitize data
	const match = String(raw).match(/\d+/)
	const elevation = match ? Number(match[0]) : 0

	if (Number.isNaN(elevation)) return 0

	return Math.min(elevation / 3000, 1)
})

// calculate colours positions
const g1x = computed(() => 10 + elevationNorm.value * 20)
const g1y = computed(() => 40 + elevationNorm.value * 20)

const g2x = computed(() => 40 + elevationNorm.value * 20)
const g2y = computed(() => 50 + elevationNorm.value * 20)

const g3x = computed(() => 70 + elevationNorm.value * 20)
const g3y = computed(() => 30 + elevationNorm.value * 20)
</script>

<template>
	<button class="bean-card" @click="emits('clicked', bean)">
		<slot />
	</button>
</template>

<style scoped>
button {
	color: #fff;
	text-align: left;
}

.bean-card {
	transform: translateZ(0);
  will-change: transform;

	position: relative;
  isolation: isolate;

	grid-column: 1 / 5;
	border-radius: var(--pico-border-radius);

	box-sizing: border-box;

	border: 2px inset oklch(from v-bind(priColor) l c h / 0.2);

	box-shadow:
		0 0 0 1px oklch(from v-bind(priColor) l c h / 0.15),
		0 4px 6px oklch(from var(--husk-shadow) l c h / 0.6),
		0 2px 4px oklch(from v-bind(priColor) l c h / 0.35),
		0 6px 12px oklch(from v-bind(secColor) l c h / 0.28),
		0 12px 24px oklch(from v-bind(accColor) l c h / 0.22);
	padding: 12px;
	position: relative;
	overflow: hidden;

	background:
    linear-gradient(
      rgba(255,255,255,0.25),
      rgba(255,255,255,0.1)
    ) border-box,

    radial-gradient(
      ellipse 80% 100% at v-bind(g1x + '%') v-bind(g1y + '%'),
      v-bind(priColor) 0%,
      v-bind(priColor) 30%,
      transparent 80%
    ) padding-box,

    radial-gradient(
      ellipse 75% 110% at v-bind(g2x + '%') v-bind(g2y + '%'),
      v-bind(secColor) 0%,
      v-bind(secColor) 30%,
      transparent 80%
    ) padding-box,

    radial-gradient(
      ellipse 85% 100% at v-bind(g3x + '%') v-bind(g3y + '%'),
      v-bind(accColor) 0%,
      v-bind(accColor) 30%,
      transparent 80%
    ) padding-box;

		/* fallback background */
		background-color: oklch(from v-bind(priColor) calc(l - 0.05) c h / 0.6);

	z-index: 0;
}
</style>

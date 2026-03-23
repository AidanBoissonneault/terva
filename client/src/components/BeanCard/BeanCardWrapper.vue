<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Bean } from '@/types';
import { useChromaStore } from '@/stores/chromaCalculator';

const props = defineProps<{
	bean: Bean
}>()

const lightness = ref('0.7') // fallback default

// reset lightness if possible
onMounted(() => {
	lightness.value = getComputedStyle(document.documentElement)
		.getPropertyValue('--lightness')
		.trim()
})

// get chroma store and calculate
const chromaCalculator = useChromaStore()
const chroma = ref(chromaCalculator.getChroma(props.bean.status))

// calculate colors
const priColor = computed(() =>
	`oklch(${lightness.value} ${chroma.value} ${props.bean.pri_hue})`
)
const secColor = computed(() =>
	`oklch(${lightness.value} ${chroma.value} ${props.bean.sec_hue})`
)
const accColor = computed(() =>
	`oklch(${lightness.value} ${chroma.value} ${props.bean.acc_hue})`
)

// calculate elevation from 0-1 to use as a scale for calculating positions in colours
const elevationNorm = computed(() =>
	Math.min((props.bean.elevation_m ?? 0) / 3000, 1)
)

// calculate colours positions
const g1x = computed(() => 10 + elevationNorm.value * 20)
const g1y = computed(() => 40 + elevationNorm.value * 20)

const g2x = computed(() => 40 + elevationNorm.value * 20)
const g2y = computed(() => 50 + elevationNorm.value * 20)

const g3x = computed(() => 70 + elevationNorm.value * 20)
const g3y = computed(() => 30 + elevationNorm.value * 20)
</script>

<template>
	<div class="bean-card">
		<slot />
	</div>
</template>

<style scoped>

.bean-card {
	grid-column: 1 / 5;
	border-radius: 12px;
	box-shadow:
		0 4px 6px oklch(from var(--neutral-900) l c h / 0.6),
		0 2px 4px oklch(from v-bind(priColor) l c h / 0.35),
		0 6px 12px oklch(from v-bind(secColor) l c h / 0.28),
		0 12px 24px oklch(from v-bind(accColor) l c h / 0.22);
	padding: 12px;
	position: relative;
	overflow: hidden;
	background-color: var(--neutral-200);
	background-image:
		radial-gradient(ellipse 80% 100% at v-bind(g1x + '%') v-bind(g1y + '%'),
			v-bind(priColor) 0%,
			v-bind(priColor) 45%,
			transparent 100%),
		radial-gradient(ellipse 75% 110% at v-bind(g2x + '%') v-bind(g2y + '%'),
			v-bind(secColor) 0%,
			v-bind(secColor) 45%,
			transparent 100%),
		radial-gradient(ellipse 85% 100% at v-bind(g3x + '%') v-bind(g3y + '%'),
			v-bind(accColor) 0%,
			v-bind(accColor) 45%,
			transparent 100%);
	z-index: 0;
}

.bean-card::before {
	content: "";
	position: absolute;
	inset: -10%;
	background: inherit;
	filter: blur(30px);
	opacity: 0.6;
	z-index: -1;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Bean } from '@terva/shared';
import { useChromaStore } from '@/stores/chromaCalculator';

const props = defineProps<{
	bean: Bean
}>()

const lightness = ref(0.7)

onMounted(() => {
	lightness.value = Number(
		getComputedStyle(document.documentElement)
			.getPropertyValue('--lightness')
			.trim(),
	)
})

const chromaCalculator = useChromaStore()
const chroma = ref(chromaCalculator.getChroma(props.bean.state))

const priColor = computed(() => `oklch(${lightness.value - 0.02} ${chroma.value} ${props.bean.pri_hue})`)
const secColor = computed(() => `oklch(${lightness.value + 0.04} ${chroma.value} ${props.bean.sec_hue})`)
const accColor = computed(() => `oklch(${lightness.value + 0.08} ${chroma.value} ${props.bean.acc_hue})`)
</script>

<template>
	<div class="end-brew-header">
		<h2>{{ bean.name }}</h2>
		<small v-if="bean.roaster">{{ bean.roaster }}</small>
	</div>
</template>

<style scoped>
.end-brew-header {
	grid-column: 1 / 5;
	border-radius: var(--pico-border-radius);
	box-sizing: border-box;
	padding: 16px;
	overflow: hidden;
	position: relative;
	isolation: isolate;

	box-shadow:
		inset 0 1px 0 oklch(1 0 0 / 0.35),
		inset 0 -1px 0 oklch(0 0 0 / 0.15),
		0 0 0 1px oklch(from v-bind(priColor) l c h / 0.2),
		0 4px 6px oklch(from var(--terva-shadow) l c h / 0.6),
		0 2px 4px oklch(from v-bind(priColor) l c h / 0.20),
		0 6px 12px oklch(from v-bind(secColor) l c h / 0.05),
		0 12px 24px oklch(from v-bind(accColor) l c h / 0.10);

	background:
		linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0.04)) border-box,
		radial-gradient(ellipse 70% 120% at 15% 40%, oklch(from v-bind(secColor) l c h / 0.55) 0%, transparent 100%) padding-box,
		radial-gradient(ellipse 70% 120% at 85% 30%, oklch(from v-bind(accColor) l c h / 0.45) 0%, transparent 100%) padding-box,
		v-bind(priColor) padding-box;

	background-color: v-bind(priColor);
	color: #fff;
}

h2 {
	--pico-h2-color: #fff;
	--pico-color: #fff;
	margin: 0;
	padding: 0;
}

small {
	opacity: 0.8;
	color: #fff;
}
</style>

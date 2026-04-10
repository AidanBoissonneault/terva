<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Brew, Gear, Recipe } from '@terva/shared'
import BeanCardSeperator from '@/components/BeanCard/BeanCardSeperator.vue'
import { useBrewTransferStore } from '@/stores/currentBrewTransfer';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps<{
	brew: Brew
	gear: Gear[]
	recipes: Recipe[]
}>()

// fallback lightness
const lightness = ref(0.7)

onMounted(() => {
	lightness.value = Number(
		getComputedStyle(document.documentElement)
			.getPropertyValue('--lightness')
			.trim(),
	)
})

//   Closeness to colour hues
//   success → green  (hue 135)
//   close   → orange (hue  55)
//   miss    → red    (hue  25)

const hue = computed(() => {
	switch (props.brew.closeness) {
		case 'success': return 135
		case 'close': return 55
		default: return 25
	}
})

const chroma = computed(() => {
	// miss is slightly more saturated to read as clearly wrong
	switch (props.brew.closeness) {
		case 'success': return 0.18
		case 'close': return 0.16
		default: return 0.20
	}
})

// Three colour stops - same offset logic as BeanCardWrapper
const priColor = computed(() => `oklch(${lightness.value} ${chroma.value} ${hue.value})`)
const secColor = computed(() => `oklch(${lightness.value + 0.04} ${chroma.value} ${hue.value})`)
const accColor = computed(() => `oklch(${lightness.value + 0.08} ${chroma.value} ${hue.value})`)

// Gradient anchors - fixed positions (no elevation data on a brew)
const g1x = 15, g1y = 40
const g2x = 50, g2y = 55
const g3x = 80, g3y = 30

// Gear lookups
const brewerName = computed(() => props.gear.find(g => g.id === props.brew.brewerId)?.name ?? '-')
const grinderName = computed(() => props.gear.find(g => g.id === props.brew.grinderId)?.name ?? '-')

// Recipe lookup
const recipeName = computed(() => props.recipes.find(r => r.id === props.brew.recipeId)?.name ?? '-')

// Ratio
const ratio = computed(() => {
	if (!props.brew.doseG || !props.brew.yieldG) return null
	return (props.brew.yieldG / props.brew.doseG).toFixed(1)
})

// Time display
const timeDisplay = computed(() => {
	const s = props.brew.time_seconds
	if (!s) return null
	const m = Math.floor(s / 60)
	const sec = s % 60
	return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`
})

// transfer brew to start brew screen on click
function navigateToStartBrew() {
	const currentBrew = useBrewTransferStore()

	currentBrew.set(props.brew)
	router.push({ name: 'startbrew' })
}
</script>

<template>
	<div class="brew-card" @click="navigateToStartBrew">
		<div class="apart header-row">
			<h2>{{ recipeName }}</h2>
		</div>

		<div class="apart gear-row">
			<small>{{ brewerName }}</small>
			<small>{{ grinderName }}</small>
		</div>

		<BeanCardSeperator />

		<div class="stats">
			<div v-if="brew.doseG" class="stat">
				<span class="stat-value">{{ brew.doseG }}g</span>
				<span class="stat-label">Dose</span>
			</div>
			<div v-if="brew.yieldG" class="stat">
				<span class="stat-value">{{ brew.yieldG }}g</span>
				<span class="stat-label">Yield</span>
			</div>
			<div v-if="ratio" class="stat">
				<span class="stat-value">1:{{ Math.floor(Number(ratio)) }}</span>
				<span class="stat-label">Ratio</span>
			</div>
			<div v-if="brew.grindSize" class="stat">
				<span class="stat-value">{{ brew.grindSize }}</span>
				<span class="stat-label">Grind</span>
			</div>
			<div v-if="timeDisplay" class="stat">
				<span class="stat-value">{{ timeDisplay }}</span>
				<span class="stat-label">Time</span>
			</div>
		</div>

		<p v-if="brew.notes" class="notes">{{ brew.notes }}</p>

	</div>
</template>

<style scoped>
.brew-card {
	position: relative;
	isolation: isolate;

	grid-column: 1 / 5;
	border-radius: var(--pico-border-radius);
	box-sizing: border-box;

	border: 2px inset oklch(from v-bind(priColor) l c h / 0.2);

	box-shadow:
		0 0 0 1px oklch(from v-bind(priColor) l c h / 0.15),
		0 4px 6px oklch(from var(--treva-shadow) l c h / 0.6),
		0 2px 4px oklch(from v-bind(priColor) l c h / 0.35),
		0 6px 12px oklch(from v-bind(secColor) l c h / 0.28),
		0 12px 24px oklch(from v-bind(accColor) l c h / 0.22);

	padding: 12px;
	overflow: hidden;

	background:
		linear-gradient(rgba(255, 255, 255, 0.25),
			rgba(255, 255, 255, 0.1)) border-box,

		radial-gradient(ellipse 80% 100% at v-bind(g1x + '%') v-bind(g1y + '%'),
			v-bind(priColor) 0%,
			v-bind(priColor) 30%,
			transparent 80%) padding-box,

		radial-gradient(ellipse 75% 110% at v-bind(g2x + '%') v-bind(g2y + '%'),
			v-bind(secColor) 0%,
			v-bind(secColor) 30%,
			transparent 80%) padding-box,

		radial-gradient(ellipse 85% 100% at v-bind(g3x + '%') v-bind(g3y + '%'),
			v-bind(accColor) 0%,
			v-bind(accColor) 30%,
			transparent 80%) padding-box;

	background-color: oklch(from v-bind(priColor) calc(l - 0.05) c h / 0.6);

	color: #fff;
	z-index: 0;
}

.brew-card::before {
	content: '';
	position: absolute;
	inset: -10%;
	background: inherit;
	filter: blur(30px);
	opacity: 0.6;
	z-index: -1;
	background-clip: padding-box;
}

h2 {
	--pico-h2-color: #fff;
	--pico-color: #fff;
	padding: 0;
	margin: 0;
}

.header-row,
.gear-row {
	align-items: flex-start;
}

.gear-row {
	margin-top: 2px;
	opacity: 0.85;
}

.stats {
	display: flex;
	flex-direction: row;
	gap: 16px;
	flex-wrap: wrap;
	margin-top: 4px;
}

.stat {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.stat-value {
	font-size: 0.95rem;
	font-weight: 600;
	color: #fff;
	line-height: 1.2;
}

.stat-label {
	font-size: 0.7rem;
	opacity: 0.7;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: #fff;
}

.notes {
	margin: 6px 0 0;
	font-size: 0.8rem;
	opacity: 0.75;
	font-style: italic;
	color: #fff;
	line-height: 1.4;
}
</style>

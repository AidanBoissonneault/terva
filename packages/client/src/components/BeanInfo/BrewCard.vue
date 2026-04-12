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

const hue = computed(() => {
	switch (props.brew.closeness) {
		case 'success': return 135
		case 'close': return 55
		default: return 25
	}
})

const chroma = computed(() => {
	switch (props.brew.closeness) {
		case 'success': return 0.18
		case 'close': return 0.16
		default: return 0.12
	}
})

// Colours
const priColor = computed(() => `oklch(${lightness.value} ${chroma.value} ${hue.value})`)
const secColor = computed(() => `oklch(${lightness.value + 0.04} ${chroma.value} ${hue.value})`)
const accColor = computed(() => `oklch(${lightness.value + 0.08} ${chroma.value} ${hue.value})`)

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

	box-shadow:
		inset 0 1px 0 oklch(1 0 0 / 0.35),
		inset 0 -1px 0 oklch(0 0 0 / 0.15),
		0 0 0 1px oklch(from v-bind(priColor) l c h / 0.2),
		0 4px 6px oklch(from var(--terva-shadow) l c h / 0.6),
		0 2px 4px oklch(from v-bind(priColor) l c h / 0.20),
		0 6px 12px oklch(from v-bind(secColor) l c h / 0.05),
		0 12px 24px oklch(from v-bind(accColor) l c h / 0.10);

	padding: 12px;
	overflow: hidden;

	background:
		linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0.04)) border-box,
		radial-gradient(ellipse 70% 120% at 15% 40%, oklch(from v-bind(secColor) l c h / 0.55) 0%, transparent 100%) padding-box,
		radial-gradient(ellipse 70% 120% at 85% 30%, oklch(from v-bind(accColor) l c h / 0.45) 0%, transparent 100%) padding-box,
		v-bind(priColor) padding-box;

	background-color: v-bind(priColor);

	color: #fff;
	z-index: 0;
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

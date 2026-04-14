<!--
Brew With View
Shown during an active brew — displays recipe steps with a live timer,
step-by-step progression, and a background that reacts to the current step.
Setup and Grind steps are tap-to-advance (no timer).
The header mirrors AppBar styling; the footer action mirrors TabBar styling.

CREATED: 13APR2026
LAST EDITED: 13APR2026
By: Aidan Boissonneault
-->

<script lang="ts" setup>
import { useBrewTransferStore } from '@/stores/currentBrewTransfer'
import { useLoadingStore } from '@/stores/loading'
import { getBrewStartData } from '@/api/getStartBrewData'
import { type Recipe, type RecipeStep, type StepType } from '@terva/shared'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue'

const router = useRouter()

// ── Data ──────────────────────────────────────────────────────────────────────
const recipe = ref<Recipe | null>(null)
const error = ref<string | null>(null)

// ── Step state ────────────────────────────────────────────────────────────────
const currentStepIndex = ref(0)
const stepElapsed = ref(0)
const totalElapsed = ref(0)

let stepTimer: ReturnType<typeof setInterval> | null = null
let totalTimer: ReturnType<typeof setInterval> | null = null
const isRunning = ref(false)
const isComplete = ref(false)

// ── Overlay ───────────────────────────────────────────────────────────────────
const showFinishOverlay = ref(false)

// ── Step theme — driven by type, no keyword guessing ─────────────────────────
interface StepTheme {
	colour: string
	isPour: boolean   // drives water-rise animation
	isTap: boolean    // setup / grind — no timer, tap to advance
}

const TYPE_THEMES: Record<StepType, Omit<StepTheme, 'isTap'>> = {
	setup:    { colour: 'var(--neutral-400)',    isPour: false },
	grind:    { colour: 'var(--brand-400)',       isPour: false },
	preheat:  { colour: 'oklch(0.66 0.15 25)',   isPour: true  },
	bloom:    { colour: 'oklch(0.68 0.14 135)',  isPour: true  },
	pour:     { colour: 'oklch(0.64 0.15 210)',  isPour: true  },
	agitate:  { colour: 'oklch(0.68 0.14 55)',   isPour: false },
	drawdown: { colour: 'oklch(0.64 0.12 250)',  isPour: false },
	wait:     { colour: 'oklch(0.68 0.14 135)',  isPour: false },
}

const TAP_TYPES: StepType[] = ['setup', 'grind']

function themeForStep(step: RecipeStep | null): StepTheme {
	if (!step) return { colour: 'var(--brand-400)', isPour: false, isTap: false }
	const base = TYPE_THEMES[step.type]
	return { ...base, isTap: TAP_TYPES.includes(step.type) }
}

const currentTheme = computed(() => themeForStep(currentStep.value))

const isTapStep = computed(() => currentTheme.value.isTap)

// ── Water level logic ─────────────────────────────────────────────────────────
// Pour/bloom/preheat → rises 0→1 over step duration
// Non-water step following a water step → drains 1→0 over step duration
// Anything else → stays at 0
const waterLevel = computed(() => {
	if (currentTheme.value.isPour) return stepProgress.value
	const prevStep = currentStepIndex.value > 0
		? (recipe.value?.steps[currentStepIndex.value - 1] ?? null)
		: null
	if (prevStep && TYPE_THEMES[prevStep.type].isPour) return 1 - stepProgress.value
	return 0
})

const waterColour = computed(() => {
	if (currentTheme.value.isPour) return currentTheme.value.colour
	const prevStep = currentStepIndex.value > 0
		? (recipe.value?.steps[currentStepIndex.value - 1] ?? null)
		: null
	if (prevStep && TYPE_THEMES[prevStep.type].isPour) return TYPE_THEMES[prevStep.type].colour
	return currentTheme.value.colour
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<StepType, string> = {
	setup: 'Setup', grind: 'Grind', preheat: 'Preheat',
	bloom: 'Bloom', pour: 'Pour', agitate: 'Agitate',
	drawdown: 'Drawdown', wait: 'Wait',
}

function stepDisplayName(step: RecipeStep): string {
	return step.action?.trim() || TYPE_LABELS[step.type]
}

function formatTime(s: number): string {
	if (s <= 0) return '0:00'
	const m = Math.floor(s / 60)
	const sec = s % 60
	return `${m}:${String(sec).padStart(2, '0')}`
}

const currentStep = computed<RecipeStep | null>(() =>
	recipe.value?.steps[currentStepIndex.value] ?? null
)
const stepCount = computed(() => recipe.value?.steps.length ?? 0)

const stepProgress = computed(() => {
	if (!currentStep.value?.duration) return 0
	return Math.min(stepElapsed.value / currentStep.value.duration, 1)
})

const totalDuration = computed(() =>
	recipe.value?.steps.reduce((a, s) => a + (s.duration ?? 0), 0) ?? 0
)

const overallProgress = computed(() =>
	totalDuration.value > 0 ? Math.min(totalElapsed.value / totalDuration.value, 1) : 0
)

const stepRemaining = computed(() =>
	Math.max(0, (currentStep.value?.duration ?? 0) - stepElapsed.value)
)

const bgGradient = computed(() =>
	`radial-gradient(ellipse at 50% 0%, oklch(from ${currentTheme.value.colour} l c h / 0.10), transparent 68%)`
)

// ── Timer controls ────────────────────────────────────────────────────────────
function startTimers() {
	// Tap steps don't run a step timer — only total elapsed keeps ticking
	if (isRunning.value) return
	isRunning.value = true

	if (!isTapStep.value) {
		stepTimer = setInterval(() => {
			stepElapsed.value++
			if (currentStep.value?.duration && stepElapsed.value >= currentStep.value.duration) {
				advanceStep()
			}
		}, 1000)
	}

	totalTimer = setInterval(() => { totalElapsed.value++ }, 1000)
}

function stopTimers() {
	if (stepTimer) clearInterval(stepTimer)
	if (totalTimer) clearInterval(totalTimer)
	stepTimer = null; totalTimer = null
	isRunning.value = false
}

function advanceStep() {
	stopTimers()
	const next = currentStepIndex.value + 1
	if (next >= stepCount.value) {
		isComplete.value = true
		showFinishOverlay.value = true
		return
	}
	currentStepIndex.value = next
	stepElapsed.value = 0
	startTimers()
}

function skipStep() { stopTimers(); stepElapsed.value = 0; advanceStep() }
function restartStep() { stopTimers(); stepElapsed.value = 0; startTimers() }

function stepColour(i: number): string {
	const step = recipe.value?.steps[i]
	return step ? TYPE_THEMES[step.type].colour : 'var(--neutral-300)'
}

// ── Mount / unmount ───────────────────────────────────────────────────────────
onMounted(async () => {
	const loading = useLoadingStore()
	loading.start()
	try {
		const brewTransferStore = useBrewTransferStore()
		const brew = brewTransferStore.get()
		if (!brew.recipeId || brew.recipeId === -1) {
			router.replace({ name: 'endbrew' })
			return
		}
		const dataPayload = await getBrewStartData()
		if (!dataPayload.success) throw new Error(dataPayload.error)
		const found = (dataPayload.payload.recipes as Recipe[]).find(r => r.id === brew.recipeId)
		if (!found) throw new Error('Recipe not found')
		recipe.value = found
		startTimers()
	} catch (err) {
		error.value = err instanceof Error ? err.message : 'An unknown error occurred'
	} finally {
		loading.stop()
	}
})

onBeforeUnmount(stopTimers)

// ── Navigation ────────────────────────────────────────────────────────────────
function finishNow()   { showFinishOverlay.value = false; router.push({ name: 'endbrew' }) }
function finishLater() { showFinishOverlay.value = false; router.push({ name: 'dashboard' }) }
</script>

<template>
	<!-- Reactive background layer -->
	<div class="brew-bg" :style="{ background: bgGradient }" aria-hidden="true" />

	<div class="brew-layout">

		<!-- ── AppBar-style header ─────────────────────────────────────────── -->
		<header class="brew-header">
			<div class="header-top">
				<div class="header-left">
					<button class="back-btn" @click="router.push({ name: 'dashboard' })">
						<FontAwesomeIcon :icon="['fas', 'arrow-left']" />
					</button>
				</div>
				<div class="header-center">
					<span class="header-recipe">{{ recipe?.name ?? 'Brewing…' }}</span>
					<span class="header-elapsed">{{ formatTime(totalElapsed) }}</span>
				</div>
				<div class="header-right">
					<span class="step-counter" v-if="recipe && !isComplete">
						{{ currentStepIndex + 1 }}/{{ stepCount }}
					</span>
				</div>
			</div>

			<!-- Progress bar — flush at bottom edge of header pill -->
			<div class="header-progress-track">
				<div
					class="header-progress-fill"
					:style="{
						width: isComplete ? '100%' : (overallProgress * 100) + '%',
						background: currentTheme.colour
					}"
				/>
			</div>
		</header>

		<!-- ── Main content ───────────────────────────────────────────────── -->
		<main class="brew-main">

			<!-- Error -->
			<div v-if="error" class="center-col">
				<p>{{ error }}</p>
				<button class="glass" @click="router.push({ name: 'dashboard' })">Go home</button>
			</div>

			<template v-else-if="recipe">

				<!-- Step card -->
				<div class="step-card terva-card" :class="{ complete: isComplete }">

					<template v-if="!isComplete">
						<!-- Step label -->
						<div class="step-label">
							<span class="step-badge" :style="{ background: currentTheme.colour }">
								Step {{ currentStepIndex + 1 }}
							</span>
							<span class="step-action">{{ currentStep ? stepDisplayName(currentStep) : '' }}</span>
						</div>

						<!-- Water weight indicator -->
						<div class="step-water" v-if="currentStep?.waterG">
							<small class="muted">Target: </small>
							<span class="water-amount">{{ currentStep.waterG }}g</span>
						</div>

						<!-- Ring area — centred -->
						<div class="ring-outer">
							<div class="ring-wrap">

								<!-- Timed step — countdown ring -->
								<template v-if="!isTapStep">
									<svg class="ring" viewBox="0 0 120 120">
										<circle class="ring-track" cx="60" cy="60" r="52" />
										<circle
											class="ring-progress"
											cx="60" cy="60" r="52"
											:stroke="currentTheme.colour"
											:stroke-dashoffset="327 - stepProgress * 327"
										/>
									</svg>

									<!-- Water fill inside ring -->
									<div class="ring-inner">
										<div class="water-body">
											<div
												class="water-fill"
												:style="{
													height: (waterLevel * 100) + '%',
													background: `oklch(from ${waterColour} l c h / 0.22)`
												}"
											/>
											<div
												v-if="waterLevel > 0.02"
												class="wave-line"
												:style="{
													bottom: (waterLevel * 100) + '%',
													background: `oklch(from ${waterColour} l c h / 0.45)`
												}"
											/>
										</div>
										<div class="ring-label">
											<div class="ring-time">{{ formatTime(stepRemaining) }}</div>
											<small class="muted">remaining</small>
										</div>
									</div>
								</template>

								<!-- Tap-to-advance step -->
								<template v-else>
									<div class="tap-ring">
										<button
											class="tap-advance-btn glass"
											:style="{ borderColor: `oklch(from ${currentTheme.colour} l c h / 0.6)` }"
											@click="advanceStep"
										>
											<span class="tap-label">Done</span>
											<span class="tap-arrow">→</span>
										</button>
									</div>
								</template>

							</div>
						</div>

						<!-- Controls — only for timed steps -->
						<div class="step-controls" v-if="!isTapStep">
							<button class="glass secondary" @click="restartStep">↺ Restart</button>
							<button class="glass" @click="skipStep">Skip →</button>
						</div>
					</template>

					<!-- Complete state -->
					<div v-else class="complete-message">
						<p><strong>Brew complete!</strong></p>
						<small class="muted">Total time: {{ formatTime(totalElapsed) }}</small>
					</div>
				</div>

				<!-- Steps list -->
				<div class="steps-list" v-if="!isComplete">
					<small class="muted steps-list-label">Steps</small>
					<div
						v-for="(step, i) in recipe.steps"
						:key="step.id"
						class="step-row"
						:class="{
							done: i < currentStepIndex,
							active: i === currentStepIndex,
							upcoming: i > currentStepIndex
						}"
					>
						<span
							class="step-dot"
							:style="i <= currentStepIndex ? { background: stepColour(i) } : {}"
						/>
						<span class="step-row-action">{{ stepDisplayName(step) }}</span>
						<span class="step-row-dur muted">
							{{ step.duration ? formatTime(step.duration) : 'tap' }}
						</span>
					</div>
				</div>

			</template>
		</main>

		<!-- ── TabBar-style footer action ─────────────────────────────────── -->
		<footer class="brew-footer" v-if="!isComplete">
			<button class="finish-btn" @click="showFinishOverlay = true">
				<FontAwesomeIcon :icon="['fas', 'flag-checkered']" class="finish-icon" />
				<span>Finish early</span>
			</button>
		</footer>
		<footer class="brew-footer" v-else>
			<button class="finish-btn active" @click="finishNow">
				<FontAwesomeIcon :icon="['fas', 'flag-checkered']" class="finish-icon" />
				<span>Finish brew</span>
			</button>
		</footer>
	</div>

	<!-- Finish overlay -->
	<FullscreenOverlay :is-visible="showFinishOverlay" @outside-clicked="showFinishOverlay = false">
		<div class="confirm-content">
			<p><strong>Finish brew now?</strong></p>
			<small>You can always finish brews later.</small>
			<div class="confirm-actions">
				<button class="glass" @click="finishLater">Finish later</button>
				<button class="glass" @click="finishNow">Finish now</button>
			</div>
		</div>
	</FullscreenOverlay>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────────── */

.brew-bg {
	position: fixed;
	inset: 0;
	pointer-events: none;
	z-index: 0;
	transition: background 1.2s ease;
}

.brew-layout {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	box-sizing: border-box;
}

/* ── Header — mirrors AppBar ─────────────────────────────────────────────────── */

.brew-header {
	position: fixed;
	top: 0;
	left: var(--bar-margin);
	width: calc(100% - (2 * var(--bar-margin)));
	margin-top: 16px;
	z-index: 999;

	background: linear-gradient(to bottom,
		oklch(from var(--terva-app-bar-accent) l c h / 0.25),
		oklch(from var(--terva-app-bar-accent) l c h / 0.20));
	background-color: oklch(from var(--terva-app-bar) l c h / 0.6);
	border: 1px solid oklch(from var(--terva-app-bar-border) l c h / 0.25);
	backdrop-filter: blur(8px) saturate(1.4);
	-webkit-backdrop-filter: blur(8px) saturate(1.4);
	border-radius: var(--terva-large-corner-radius);
	box-shadow:
		0 8px 24px oklch(from var(--terva-shadow) l c h / 0.4),
		inset 0 1px 0 oklch(from var(--terva-highlight) l c h / 0.4);
	overflow: hidden;
}

.header-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 8px 20px;
}

.header-progress-track {
	height: 3px;
	width: 100%;
	background: oklch(from var(--terva-app-bar-border) l c h / 0.18);
}

.header-progress-fill {
	height: 100%;
	transition: width 1s linear, background 1.2s ease;
	border-radius: 0 2px 2px 0;
}

.header-left, .header-right {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	min-width: 40px;
}

.header-right { justify-content: flex-end; }

.header-center {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1px;
}

.header-recipe {
	font-size: 0.8rem;
	color: var(--pico-muted-color);
	line-height: 1;
}

.header-elapsed {
	font-size: 1.5rem;
	font-weight: 600;
	line-height: 1;
	color: var(--pico-color);
}

.step-counter {
	font-size: 0.8rem;
	color: var(--pico-muted-color);
}

.back-btn {
	background: none;
	border: none;
	box-shadow: none;
	padding: 6px;
	color: var(--pico-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-btn:hover { color: var(--pico-primary); }
.back-btn:active { transform: scale(0.9); }

/* ── Main ────────────────────────────────────────────────────────────────────── */

.brew-main {
	margin-top: 100px;
	padding: 16px 24px 100px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.center-col {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}

/* ── Step card ───────────────────────────────────────────────────────────────── */

.step-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	padding: 20px 16px;
	transition: border-color 0.6s ease;
}

.step-card.complete {
	border-color: oklch(from var(--green-500) l c h / 0.35);
}

.step-label {
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
}

.step-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 2px 10px;
	border-radius: 999px;
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--neutral-900);
	transition: background 0.6s ease;
	flex-shrink: 0;
}

.step-action { font-size: 1.05rem; font-weight: 500; }

.step-water {
	display: flex;
	align-items: baseline;
	gap: 4px;
	align-self: flex-start;
}

.water-amount {
	font-size: 1.1rem;
	font-weight: 600;
	color: var(--pico-primary);
}

/* ── Ring — centred ──────────────────────────────────────────────────────────── */

.ring-outer {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.ring-wrap {
	position: relative;
	width: 180px;
	height: 180px;
	flex-shrink: 0;
}

.ring {
	width: 100%;
	height: 100%;
	transform: rotate(-90deg);
}

.ring-track {
	fill: none;
	stroke: var(--neutral-200);
	stroke-width: 8;
}

.ring-progress {
	fill: none;
	stroke-width: 8;
	stroke-linecap: round;
	stroke-dasharray: 327;
	transition: stroke-dashoffset 1s linear, stroke 1.2s ease;
}

.ring-inner {
	position: absolute;
	inset: 18px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* ── Water fill ──────────────────────────────────────────────────────────────── */

.water-body {
	position: absolute;
	inset: 0;
	border-radius: 50%;
	overflow: hidden;
}

.water-fill {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	transition: height 1s linear, background 1.2s ease;
}

.wave-line {
	position: absolute;
	left: 0;
	right: 0;
	height: 3px;
	border-radius: 2px;
	transition: bottom 1s linear, background 1.2s ease;
	animation: wave-shimmer 2.5s ease-in-out infinite;
}

@keyframes wave-shimmer {
	0%, 100% { transform: scaleX(1) translateY(0); opacity: 1; }
	50%       { transform: scaleX(0.96) translateY(-1px); opacity: 0.7; }
}

.ring-label {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
	pointer-events: none;
}

.ring-time {
	font-size: 1.8rem;
	font-weight: 600;
	line-height: 1;
	text-shadow: 0 1px 6px oklch(from var(--pico-background-color) l c h / 0.7);
}

/* ── Tap-to-advance ──────────────────────────────────────────────────────────── */

.tap-ring {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tap-advance-btn {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	font-size: 1rem;
	font-weight: 600;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tap-advance-btn:active {
	transform: scale(0.93);
}

.tap-label { font-size: 1.1rem; font-weight: 600; }
.tap-arrow { font-size: 1.4rem; line-height: 1; }

/* ── Step controls ───────────────────────────────────────────────────────────── */

.step-controls {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	width: 100%;
}

/* ── Complete ────────────────────────────────────────────────────────────────── */

.complete-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 8px 0;
}

/* ── Steps list ──────────────────────────────────────────────────────────────── */

.steps-list {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.steps-list-label { margin-bottom: 4px; }

.step-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 12px;
	border-radius: var(--pico-border-radius);
	transition: background 0.2s;
}

.step-row.active {
	background: oklch(from var(--pico-primary) l c h / 0.08);
}

.step-row.done { opacity: 0.4; }

.step-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	flex-shrink: 0;
	background: var(--neutral-300);
	transition: background 0.6s ease;
}

.step-row-action { flex: 1; font-size: 0.9rem; }
.step-row-dur { font-size: 0.8rem; }
.muted { color: var(--pico-muted-color); }

/* ── Footer — mirrors TabBar exactly ─────────────────────────────────────────── */

.brew-footer {
	position: fixed;
	bottom: 20px;
	left: var(--bar-margin);
	width: calc(100% - (2 * var(--bar-margin)));
	padding: 8px;
	z-index: 999;

	background: linear-gradient(
		to bottom,
		oklch(from var(--terva-tab-bar-accent) l c h / 0.25),
		oklch(from var(--terva-tab-bar-accent) l c h / 0.20)
	);
	background-color: oklch(from var(--terva-tab-bar) l c h / 0.4);
	border: 1px solid oklch(from var(--terva-tab-bar-border) l c h / 0.25);
	backdrop-filter: blur(6px) saturate(1.6);
	-webkit-backdrop-filter: blur(6px) saturate(1.6);
	border-radius: var(--terva-large-corner-radius);
	box-shadow:
		0 8px 32px oklch(from var(--terva-shadow) l c h / 0.35),
		inset 0 1px 0 oklch(from var(--terva-highlight) l c h / 0.35);
}

.finish-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	background: none;
	border: none;
	box-shadow: none;
	padding: 16px 0;
	cursor: pointer;
	color: oklch(from var(--terva-shadow) l c h / 0.65);
	font-size: 1rem;
	font-weight: 500;
	border-radius: var(--terva-large-corner-radius);
	transition: color 0.2s ease, transform 0.15s ease;
}

.finish-btn:hover { color: oklch(from var(--brand-400) l c h / 0.85); }
.finish-btn:active { transform: scale(0.97); }
.finish-btn.active { color: var(--brand-400); }
.finish-btn.active .finish-icon { transform: scale(1.3); }

.finish-icon {
	width: 22px;
	height: 22px;
	transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── Overlay confirm ─────────────────────────────────────────────────────────── */

.confirm-content, strong {
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: var(--pico-primary-inverse);
}

.confirm-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 8px;
}
</style>

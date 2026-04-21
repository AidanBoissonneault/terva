<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits<{ done: [] }>()
const visible = ref(true)

onMounted(() => {
	if (import.meta.env.DEV) sessionStorage.setItem('__boot_shown', '1')
	setTimeout(() => { visible.value = false }, 4200)
})
</script>

<template>
	<Transition name="boot-fade" @after-leave="emit('done')">
		<div v-if="visible" class="boot-overlay" aria-hidden="true">

			<!-- Carafe pour — wide continuous stream from top of screen -->
			<svg class="boot-pour" viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
				<path d="M7,0 C5,28 9,55 7,100 L53,100 C51,55 55,28 53,0 Z" fill="var(--brand-900)" />
				<path d="M17,0 C16,28 18,55 17,100 L24,100 C23,55 25,28 24,0 Z" fill="var(--brand-800)" opacity="0.28" />
			</svg>

			<!-- Brand: sits above pour, fades out as fill rises -->
			<div class="boot-brand">
				<img class="boot-logo" src="@/assets/images/title-image.PNG" alt="" draggable="false" />
				<h1 class="boot-title">Terva</h1>
			</div>

			<!-- Coffee fill rises from bottom -->
			<div class="boot-fill" aria-hidden="true"></div>

		</div>
	</Transition>
</template>

<style scoped>
/*
	Timing overview (~5s total):
		0.0s  cream bg + brand fade in
		0.2s  pour stream reveals from top (0.5s clip-path animation)
		0.5s  fill begins rising (3.0s)
		2.0s  brand fades out (0.7s) as fill approaches it
		3.5s  fill covers screen
		4.2s  JS triggers fade-out (0.8s)
		5.0s  after-leave → emit done
*/

/* ── Overlay ────────────────────────────────────────────────── */
.boot-overlay {
	position: fixed;
	inset: 0;
	z-index: 100;
	background: var(--brand-100);
	overflow: hidden;
}

/* ── Brand ──────────────────────────────────────────────────── */
.boot-brand {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16px;
	z-index: 2;
	will-change: opacity, transform;
	animation:
		boot-brand-in 0.5s ease-out both,
		boot-brand-out 0.7s ease-in 2.0s forwards;
}

@keyframes boot-brand-in {
	from {
		opacity: 0;
		transform: translate(-50%, calc(-50% + 10px));
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%);
	}
}

@keyframes boot-brand-out {
	from { opacity: 1; }
	to   { opacity: 0; }
}

.boot-logo {
	width: clamp(80px, 15vw, 120px);
	height: clamp(80px, 15vw, 120px);
	object-fit: contain;
}

.boot-title {
	font-family: 'Camela';
	font-weight: 500;
	text-shadow: 0px 1px var(--brand-500);

	--pico-font-size: 2.5rem;
	--pico-line-height: 1.125;
	--pico-typography-spacing-top: 3rem;
}

/* ── Carafe pour stream ──────────────────────────────────────── */
/* SVG is 60px wide × 100vh tall; clip-path reveals top→bottom */
.boot-pour {
	position: absolute;
	left: 50%;
	top: 0;
	width: 60px;
	height: 100vh;
	transform: translateX(-50%);
	will-change: clip-path;
	animation: boot-pour-reveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes boot-pour-reveal {
	from { clip-path: inset(0 0 100% 0); }
	to   { clip-path: inset(0 0 0 0); }
}

/* ── Coffee fill (GPU-composited scaleY from bottom) ────────── */
.boot-fill {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 105vh;
	background: var(--brand-900);
	transform-origin: bottom center;
	transform: scaleY(0);
	will-change: transform;
	animation: boot-fill-rise 3.0s cubic-bezier(0.4, 0.0, 0.55, 1.0) 0.5s both;
}

@keyframes boot-fill-rise {
	from { transform: scaleY(0); }
	to   { transform: scaleY(1); }
}

/* ── Vue Transition: overlay fade-out ──────────────────────── */
.boot-fade-leave-active {
	transition: opacity 0.8s ease-in;
	will-change: opacity;
}
.boot-fade-leave-to {
	opacity: 0;
}

/* ── Reduced motion ─────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
	.boot-brand  { animation: none; opacity: 1; transform: translate(-50%, -50%); }
	.boot-pour   { animation: none; clip-path: inset(0 0 0 0); }
	.boot-fill   { animation: none; transform: scaleY(1); }
	.boot-fade-leave-active { transition-duration: 0.2s; }
}
</style>

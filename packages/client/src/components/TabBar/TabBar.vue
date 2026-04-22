<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { TabButton } from '@/types'
import TabIcon from './TabIcon.vue'
import { useOptimisticRouterStore } from '@/stores/optimisticRouter'
import { storeToRefs } from 'pinia'
import { watch, ref, computed, useTemplateRef } from 'vue'
import { routeImporters } from '@/router'

const optimisticRouter = useOptimisticRouterStore()

const tabs = <TabButton[]>[
	{ icon: 'house', route: 'dashboard' },
	{ icon: 'screwdriver-wrench', route: 'gear' },
	{ icon: 'scroll', route: 'recipe' },
	{ icon: 'user', route: 'profile' },
]

const tabLength = tabs.length
const route = useRoute()
const router = useRouter()

// Prefetch
const prefetched = new Set<string>()

function prefetch(routeName: string) {
  if (prefetched.has(routeName) || routeName === route.name) return
  prefetched.add(routeName)
  routeImporters[routeName]?.() // triggers dynamic import
}

// Pill drag
const footerRef = useTemplateRef<HTMLElement>('footer')
const pillRef = useTemplateRef<HTMLElement>('pill')

const dragIndex = ref<number | null>(null)
const isDragging = ref(false)

// True committed route — drives glow
const trueRoute = computed(() => (route.name as string) ?? '')

function getTabIndex(routeName: string) {
	return tabs.findIndex(t => t.route === routeName)
}

function closestTabIndex(clientX: number): number {
	const footer = footerRef.value
	if (!footer) return -1
	const rect = footer.getBoundingClientRect()
	const clamped = Math.max(rect.left, Math.min(rect.right, clientX))
	const ratio = (clamped - rect.left) / rect.width
	return Math.min(tabLength - 1, Math.max(0, Math.floor(ratio * tabLength)))
}

function isOverFooter(clientX: number, clientY: number): boolean {
	const footer = footerRef.value
	if (!footer) return false
	const rect = footer.getBoundingClientRect()
	const SLACK = 40
	return (
		clientX >= rect.left &&
		clientX <= rect.right &&
		clientY >= rect.top - SLACK &&
		clientY <= rect.bottom + SLACK
	)
}

function setPillToIndex(index: number) {
	const footer = footerRef.value
	const pill = pillRef.value
	if (!footer || !pill) return

	const rect = footer.getBoundingClientRect()
	const slotW = rect.width / tabLength
	const left = slotW * index
	const right = rect.width - slotW * (index + 1)

	pill.style.position = 'absolute'
	pill.style.top = '0px'
	pill.style.bottom = '0px'
	pill.style.left = `${left}px`
	pill.style.right = `${right}px`
}

function clearPillOverride() {
	const pill = pillRef.value
	if (!pill) return
	pill.style.position = ''
	pill.style.top = ''
	pill.style.bottom = ''
	pill.style.left = ''
	pill.style.right = ''
}

function onPointerDown(e: PointerEvent, routeName: string) {
	isDragging.value = true
	const idx = getTabIndex(routeName)
	dragIndex.value = idx
	optimisticRouter.setRoute(routeName)
	prefetch(routeName)
	;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
	if (!isDragging.value) return

	const idx = closestTabIndex(e.clientX)
	if (idx === -1) return

	if (idx !== dragIndex.value) {
		dragIndex.value = idx
		prefetch(tabs[idx]!.route)
	}

	setPillToIndex(idx)
	optimisticRouter.setRoute(tabs[idx]!.route)
}

function onPointerUp(e: PointerEvent) {
	if (!isDragging.value) return
	isDragging.value = false

	const over = isOverFooter(e.clientX, e.clientY)
	clearPillOverride()

	if (over && dragIndex.value !== null) {
		const target = tabs[dragIndex.value]!.route
		optimisticRouter.setRoute(target)
		if (target !== route.name) {
			router.push({ name: target })
		}
	} else {
		optimisticRouter.setRoute(route.name as string)
	}

	dragIndex.value = null
}

// Navigation
function navigate(routeName: string) {
	if (route.name === routeName) return
	optimisticRouter.setRoute(routeName)
	router.push({ name: routeName })
}

const { currentRoute: activePage } = storeToRefs(optimisticRouter)

watch(() => route.name, (name) => {
	if (name) optimisticRouter.setRoute(name as string)
}, { immediate: true })
</script>

<template>
	<footer
		ref="footer"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerUp"
	>
		<div
			class="active-pill"
			:class="{ dragging: isDragging }"
			ref="pill"
			aria-hidden="true"
		/>
		<TabIcon
			v-for="(tab, i) in tabs"
			:key="i"
			:icon="tab.icon"
			:route="tab.route"
			:activePage="activePage"
			:trueRoute="trueRoute"
			@pointerdown="onPointerDown($event, tab.route)"
			@navigate="navigate"
		/>
	</footer>
</template>

<style scoped>
footer {
	position: fixed;
	bottom: 20px;
	left: var(--bar-margin);
	width: calc(100% - (2 * var(--bar-margin)));

	padding: 8px;

	background: linear-gradient(
		to bottom,
		oklch(from var(--terva-tab-bar-accent) l c h / 0.25),
		oklch(from var(--terva-tab-bar-accent) l c h / 0.2)
	);
	background-color: oklch(from var(--terva-tab-bar) l c h / 0.4);
	border: 1px solid oklch(from var(--terva-tab-bar-border) l c h / 0.25);

	backdrop-filter: blur(6px) saturate(1.6);
	-webkit-backdrop-filter: blur(6px) saturate(1.6);

	display: grid;
	grid-template-columns: repeat(v-bind(tabLength), 1fr);

	border-radius: var(--terva-large-corner-radius);

	box-shadow:
		0 8px 32px oklch(from var(--terva-shadow) l c h / 0.35),
		inset 0 1px 0 oklch(from var(--terva-highlight) l c h / 0.35);

	z-index: 999;

	contain: layout;
	overflow: visible;

	touch-action: none;
}

.active-pill {
	position: absolute;
	position-anchor: --active-tab;

	inset: anchor(top) anchor(right) anchor(bottom) anchor(left);

	border-radius: var(--terva-large-corner-radius);
	border: 1px solid oklch(from var(--terva-highlight) l c h / 0.3);
	background-color: oklch(from var(--brand-200) l c h / 0.25);

	box-shadow:
		inset 0 1px 0 oklch(from var(--terva-highlight) l c h / 0.3),
		0 2px 8px oklch(from var(--terva-shadow) l c h / 0.15);

	pointer-events: none;
	z-index: 0;

	transition:
		left 0.2s cubic-bezier(0.34, 1.4, 0.64, 1),
		right 0.35s cubic-bezier(0.22, 1, 0.36, 1),
		top 0.2s ease,
		bottom 0.2s ease,
		transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1),
		opacity 0.2s ease,
		corner-radius 0.2s ease;
}

/* Pill grows outside the bar bounds and fades during drag */
.active-pill.dragging {
	transform: scaleY(1.2) scaleX(1.4);
	opacity: 0.9;
	border-radius: calc(var(--terva-large-corner-radius) - 2px);
}

.active-pill.right {
	animation: squish 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
	transition:
		left 0.35s cubic-bezier(0.22, 1, 0.36, 1),
		right 0.2s cubic-bezier(0.34, 1.4, 0.64, 1),
		top 0.15s cubic-bezier(0.34, 2.2, 0.64, 1),
		bottom 0.15s cubic-bezier(0.34, 2.2, 0.64, 1);
}

.active-pill.left {
	animation: squish 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
	transition:
		left 0.2s cubic-bezier(0.34, 1.4, 0.64, 1),
		right 0.35s cubic-bezier(0.22, 1, 0.36, 1),
		top 0.15s cubic-bezier(0.34, 2.2, 0.64, 1),
		bottom 0.15s cubic-bezier(0.34, 2.2, 0.64, 1);
}

@keyframes squish {
	0% {
		transform: scaleY(1) translateY(0);
	}
	30% {
		transform: scaleY(0.85) translateY(2px);
	}
	65% {
		transform: scaleY(1.08) translateY(-1px);
	}
	100% {
		transform: scaleY(1) translateY(0);
	}
}
</style>

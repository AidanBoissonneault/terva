<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TabButton } from '@/types'
import TabIcon from './TabIcon.vue'

const tabs = <TabButton[]>[
	{ icon: 'house', route: 'dashboard' },
	{ icon: 'screwdriver-wrench', route: 'gear' },
	{ icon: 'user', route: 'profile' },
	{ icon: 'bars', route: 'more' },
]

const tabLength = tabs.length
const route = useRoute()
const router = useRouter()

const direction = ref()

function navigate(routeName: string) {
	if (route.name === routeName) return

	const currentIndex = tabs.findIndex((t) => t.route === route.name)
	const nextIndex = tabs.findIndex((t) => t.route === routeName)
	direction.value = nextIndex > currentIndex ? 'right' : 'left'

	router.push({ name: routeName })
}

const activePage = computed(() => route.name?.toString().toLowerCase() ?? '')
</script>

<template>
	<footer>
		<div class="active-pill" aria-hidden="true" />
		<TabIcon
			v-for="(tab, i) in tabs"
			:key="i"
			:icon="tab.icon"
			:route="tab.route"
			:activePage="activePage"
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
		oklch(from var(--husk-tab-bar-accent) l c h / 0.25),
		oklch(from var(--husk-tab-bar-accent) l c h / 0.2)
	);
	background-color: oklch(from var(--husk-tab-bar) l c h / 0.6);
	border: 1px solid oklch(from var(--husk-tab-bar-border) l c h / 0.25);

	backdrop-filter: blur(12px) saturate(1.6);
	-webkit-backdrop-filter: blur(12px) saturate(1.6);

	display: grid;
	grid-template-columns: repeat(v-bind(tabLength), 1fr);

	border-radius: var(--husk-large-corner-radius);

	box-shadow:
		0 8px 32px oklch(from var(--husk-shadow) l c h / 0.35),
		inset 0 1px 0 oklch(from var(--husk-highlight) l c h / 0.35);

	z-index: 999;

	contain: layout;
	overflow: clip;
}

.active-pill {
	position: absolute;
	position-anchor: --active-tab;

	inset: anchor(top) anchor(right) anchor(bottom) anchor(left);

	border-radius: var(--husk-large-corner-radius);
	border: 1px solid oklch(from var(--husk-highlight) l c h / 0.3);
	background-color: oklch(from var(--brand-200) l c h / 0.25);

	box-shadow:
		inset 0 1px 0 oklch(from var(--husk-highlight) l c h / 0.3),
		0 2px 8px oklch(from var(--husk-shadow) l c h / 0.15);

	pointer-events: none;
	z-index: 0;

	transition:
		left 0.2s cubic-bezier(0.34, 1.4, 0.64, 1),
		right 0.35s cubic-bezier(0.22, 1, 0.36, 1),
		top 0.2s ease,
		bottom 0.2s ease;
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

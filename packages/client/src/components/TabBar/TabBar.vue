<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TabButton } from '@/types'
import TabIcon from './TabIcon.vue'

const tabs = <TabButton[]>[
	{ icon: 'house', route: 'dashboard' },
	{ icon: 'screwdriver-wrench', route: 'gear' },
	{ icon: 'bars', route: 'more' },
]

const tabLength = tabs.length
const route = useRoute()
const router = useRouter()

function navigate(route: string) {
	router.push({ name: route })
}

const activePage = computed(() => route.name?.toString().toLowerCase() ?? '')
</script>

<template>
	<footer>
		<div class="active-pill" aria-hidden="true" />
		<TabIcon v-for="(tab, i) in tabs" :key="i" :icon="tab.icon" :route="tab.route"
			:activePage="activePage" @navigate="navigate" />
	</footer>
</template>

<style scoped>
footer {
	position: fixed;
	bottom: 20px;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - (2 * var(--bar-margin)));

	padding: 8px;

	background: linear-gradient(to bottom,
			oklch(from var(--husk-tab-bar-accent) l c h / 0.25),
			oklch(from var(--husk-tab-bar-accent) l c h / 0.2));
	background-color: oklch(from var(--husk-tab-bar) l c h / 0.6);
	border: 1px solid oklch(from var(--husk-tab-bar-border) l c h / 0.25);

	backdrop-filter: blur(12px) saturate(1.6);
	-webkit-backdrop-filter: blur(12px) saturate(1.6);

	display: grid;
	grid-template-columns: repeat(v-bind(tabLength), 1fr);

	border-radius: 14px;

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

	inset:
		anchor(top) anchor(right) anchor(bottom) anchor(left);

	border-radius: 10px;
	background-color: oklch(from var(--brand-200) l c h / 0.25);
	box-shadow:
		inset 0 1px 0 oklch(from var(--husk-highlight) l c h / 0.3),
		0 2px 8px oklch(from var(--husk-shadow) l c h / 0.15);

	pointer-events: none;
	z-index: 0;

	transition-property: top, bottom, left, right;
	transition-duration: 0.3s;
	transition-timing-function: cubic-bezier(0.34, 1.4, 0.64, 1);
}
</style>

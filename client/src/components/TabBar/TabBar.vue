<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TabButton } from '@/types'
import TabIcon from './TabIcon.vue'

const tabs = <TabButton[]>[
	{ icon: 'house', text: 'Dashboard', route: 'dashboard' },
	{ icon: 'gear', text: 'Gear', route: 'gear' },
	{ icon: 'ellipsis-vertical', text: 'More', route: 'more' },
]

const tabLength = tabs.length

const route = useRoute()
const router = useRouter()

function navigate(route: string) {
	router.push({ name: route });
}

const activePage = computed(() => route.name?.toString().toLowerCase() ?? '')
</script>

<template>
	<footer>
		<TabIcon v-for="(tab, i) in tabs" :key="i" :icon="tab.icon" :text="tab.text" :route="tab.route"
			:activePage="activePage" @navigate="navigate" />
	</footer>
</template>

<style scoped>
footer {
	position: fixed;
	bottom: 0;

	width: calc(100% - (2 * var(--bar-margin)));
	height: auto;

	background: linear-gradient(to bottom,
			oklch(from var(--husk-tab-bar-accent) l c h / 0.25),
			oklch(from var(--husk-tab-bar-accent) l c h / 0.20));
	background-color: oklch(from var(--husk-tab-bar) l c h / 0.6);
	border: 1px solid oklch(from var(--husk-tab-bar-border) l c h / 0.25);

	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);

	margin: var(--bar-margin);
	margin-bottom: 24px;

	display: grid;
	grid-template-columns: repeat(v-bind(tabLength), 1fr);

	border-radius: 12px;
	box-shadow:
		0 8px 24px oklch(from var(--husk-shadow) l c h / 0.4),
		inset 0 1px 0 oklch(from var(--husk-highlight) l c h / 0.4);

	z-index: 999;
}
</style>

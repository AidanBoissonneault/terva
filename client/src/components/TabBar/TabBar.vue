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

	width: calc(100% - (2 * 24px));
	height: auto;

	background: linear-gradient(to bottom,
			oklch(var(--brand-300-raw) / 0.25),
			oklch(var(--brand-300-raw) / 0.20));
	background-color: oklch(var(--brand-200-raw) / 0.6);
	border: 1px solid oklch(var(--brand-100-raw) / 0.25);

	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	margin: 24px;

	display: grid;
	grid-template-columns: repeat(v-bind(tabLength), 1fr);

	border-radius: 12px;
	box-shadow:
		0 8px 24px oklch(var(--neutral-900-raw) / 0.4),
		inset 0 1px 0 oklch(var(--neutral-100-raw) / 0.4);

	z-index: 999;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	icon: string
	route: string
	activePage: string
	trueRoute: string
}>()

const emit = defineEmits<{
	navigate: [route: string]
}>()

// Drives anchor positioning + icon scale — follows finger during drag
const isActivePage = computed(() => props.route === props.activePage)

// Drives glow only — always the real committed route
const isTruePage = computed(() => props.route === props.trueRoute)

const iconType = 'fas'
</script>

<template>
	<button
		@click="emit('navigate', route)"
		:class="{ active_tab: isActivePage, true_tab: isTruePage }"
		:aria-current="isTruePage ? 'page' : undefined"
	>
		<FontAwesomeIcon :icon="[iconType, icon]" class="tab-icon" />
	</button>
</template>

<style scoped>
button {
	position: relative;
	z-index: 1;

	display: flex;
	align-items: center;
	justify-content: center;

	border: none;
	box-shadow: none;
	background-color: transparent;
	border-radius: 10px;
	padding: 20px 0;
	cursor: pointer;

	color: oklch(from var(--terva-shadow) l c h / 0.65);

	transition:
		color 0.2s ease,
		transform 0.15s ease;

	transform: translateZ((0));
	will-change: transform;
}

button:focus {
	outline: none;
}

button:focus-visible {
	outline: none;
}

button:active {
	transform: scale(0.92);
}

.active_tab {
	anchor-name: --active-tab;
	color: var(--brand-400);
}

.tab-icon {
	width: 22px;
	height: 22px;
	transition:
		transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.active_tab .tab-icon {
	transform: scale(1.3);
}
</style>

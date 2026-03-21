<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
	icon: string
	text: string
	route: string
	activePage: string
}>()

const emit = defineEmits<{
	navigate: [route: string]
}>()

const isActivePage = computed(() => props.route === props.activePage)

/*
const hasOutline = <string[]>['house']
const iconType = computed(() => (!isActivePage.value && hasOutline.includes(props.icon)) ? 'far' : 'fas')
*/
const iconType = ref('fas')
</script>

<template>
	<button @click="emit('navigate', route)" :class="{ active_tab: isActivePage }">
		<FontAwesomeIcon :icon="[iconType, icon]" />
		<span>{{ text }}</span>
	</button>
</template>

<style scoped>
button {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	border: none;
	background-color: transparent;

	border-radius: 12px;

	box-shadow: none;
}

button:hover {
	background-color: oklch(var(--brand-300-raw) / 0.7);
}

.active_tab {
	background-color: oklch(var(--brand-200-raw) / 0.3);
}
</style>

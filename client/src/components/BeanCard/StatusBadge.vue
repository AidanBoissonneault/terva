<script lang="ts" setup>
import type { BeanState } from '@/types';
import { computed } from 'vue';


const props = defineProps<{
	status: BeanState
}>()

// brightness of colour
const brightness = 400

// calculated based on bean status
const colour = computed(() => {
	switch (props.status) {
		case 'fresh':
			return `var(--green-${brightness})`
		case 'frozen':
			return `var(--blue-${brightness})`
		default:
			return `var(--red-${brightness})`
	}
})
</script>

<template>
	<div></div>
</template>

<style scoped>
div {
	display: inline-block;

	margin: 0;
	padding: 0;
	width: 1rem;
	height: 1rem;

	border-radius: 50%;
	background-color: v-bind(colour);

	box-shadow: 0 4px 6px oklch(from var(--husk-shadow) l c h / 0.6),
							0 0 8px 1px oklch(from v-bind(colour) l c h / 0.6),
							inset 0 0 2px oklch(from v-bind(colour) calc(l - 0.3) calc(c - 0.1) h / 0.4);
}
</style>

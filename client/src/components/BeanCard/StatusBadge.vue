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
}
</style>

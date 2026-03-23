<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';

const props = defineProps<{
	route: string
	activeRoute: string
}>()

const emit = defineEmits<{
	navigate: [route: string]
}>()

const isOnPage = computed(() => props.route === props.activeRoute)
</script>

<template>
	<div class="wrapper">
		<button @click="emit('navigate', route)" class="main-button glass big-text" :disabled="isOnPage">
			<FontAwesomeIcon :icon="['fas', 'plus']"/>
		</button>
	</div>
</template>

<style scoped>
.wrapper {
	position: relative;
	padding: 0;
	margin: 0;
	width: 48px;
	height: 48px;
}

.main-button {
	position: absolute;

	border-radius: 50%;
	width: 100%;
	height: 100%;

	/*background-color: var(--brand-400);
	box-shadow: 0 2px var(--brand-600); */

	font-size: 48px;
	padding: 10px;
	line-height: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	transition: transform 0.15s ease;
}

.main-button:hover {
	transform: scale(1.05);
}

.invisible {
	opacity: 0;
	pointer-events: none;
}
</style>

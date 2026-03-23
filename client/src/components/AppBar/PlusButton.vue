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
		<button @click="emit('navigate', route)" class="transparent" :disabled="isOnPage">
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

.transparent {
	position: absolute;

	font-size: 36px;
	padding: 0;
	line-height: 1;

	background: none;
	background-color: none;
	border: none;
	box-shadow: none;

	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;

	width: 100%;
	height: 100%;

	color: var(--pico-primary);
}

.invisible {
	opacity: 0;
	pointer-events: none;
}
</style>

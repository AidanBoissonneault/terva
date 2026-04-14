<script lang="ts" setup generic="T">
import { computed } from 'vue';

const props = defineProps<{
	type: T | null
	activeFilter: T | null
}>()

const emit = defineEmits<{
	filter: [type: T | null]
}>()

const isActiveFilter = computed(() => props.type === props.activeFilter)
</script>

<template>
	<button
		@click="emit('filter', type)"
		class="glass"
		:class="{ contrast: isActiveFilter, underline: isActiveFilter }"
	>
		<slot />
	</button>
</template>

<style scoped>
button {
	margin: 0 0 0 4px;
	padding: 0 4px;
	border-radius: 4px;
}

.underline {
	text-decoration: underline;
}
</style>

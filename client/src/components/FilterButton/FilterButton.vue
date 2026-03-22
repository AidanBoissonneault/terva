<script lang="ts" setup>
import { computed } from 'vue';


const props = defineProps<{
	type: string
	activeFilter: string | null
}>()

const emit = defineEmits<{
	filter: [type: string]
}>()

const isActiveFilter = computed(() => props.type === props.activeFilter)
</script>

<template>
	<button @click="emit('filter', type)" :class="{ contrast: isActiveFilter }">
		<slot />
	</button>
</template>

<style scoped>
button {
	padding: 0;
	margin: 0;
	padding-left: 4px;
	padding-right: 4px;
	margin-left: 4px;
	border-radius: 4px;
}
</style>

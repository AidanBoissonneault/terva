<script lang="ts" setup>
import { computed } from 'vue';
import { type BeanState } from '@/types'


const props = defineProps<{
	type: BeanState
	activeFilter: BeanState | null
}>()

const emit = defineEmits<{
	filter: [type: BeanState]
}>()

const isActiveFilter = computed(() => props.type === props.activeFilter)
</script>

<template>
	<button @click="emit('filter', type)" class="glass" :class="{ contrast: isActiveFilter }">
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

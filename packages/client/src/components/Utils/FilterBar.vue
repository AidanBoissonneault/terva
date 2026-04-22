<script lang="ts" setup generic="T">
import { computed } from 'vue'
import FilterButton from '@/components/FilterButton/FilterButton.vue'

const props = defineProps<{
	filters: { name: string; type: T | null }[]
	activeFilter: T | null
}>()

const emit = defineEmits<{
	filter: [type: T | null]
}>()

const visibleFilters = computed(() => props.filters.filter((f) => f.type !== props.activeFilter))
</script>

<template>
	<div class="filter-wrapper">
		<slot name="label" />
		<TransitionGroup name="filter" tag="div" class="filter-buttons">
			<FilterButton
				v-for="filter in visibleFilters"
				:key="filter.name"
				@filter="emit('filter', $event)"
				:type="filter.type"
				:active-filter="activeFilter"
			>
				{{ filter.name }}
			</FilterButton>
		</TransitionGroup>
	</div>
</template>

<style scoped>
.filter-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.filter-buttons {
	display: flex;
	justify-content: center;
	align-content: center;
}

.filter-enter-from,
.filter-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
.filter-enter-to,
.filter-leave-from {
	opacity: 1;
	transform: translateY(0);
}
.filter-enter-active {
	transition: all 0.5s ease;
}
.filter-leave-active {
	transition: all 0.25s ease;
	position: absolute;
}
.filter-move {
	transition: transform 0.25s ease;
}
</style>

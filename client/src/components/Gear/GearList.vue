<script lang="ts" setup>
import type { Gear, GearCategory } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
	type: GearCategory
	gears: Gear[] | null
	openGear: string | null
	searchBar: string
}>()

const emits = defineEmits<{
	changeOpenGear: [string | null]
}>()

const prettyCategory = computed(() =>
	props.type
		.replace(/_/g, ' ')
		.replace(/\b\w/g, c => c.toUpperCase())
)

const search = computed(() => props.searchBar.trim().toLowerCase())

const categoryMatches = computed(() => {
  if (!search.value) return false
  return prettyCategory.value.toLowerCase().includes(search.value)
})

function isMatchingInput(input: string) {
	if (categoryMatches.value) return true

	return (input.toLowerCase().includes(search.value)
  ) ?? false
}

const showCategory = computed(() => {
	if(!search.value) return true

  if (!props.searchBar) return true

  return props.gears?.some(gear =>
    isMatchingInput(gear.name)
  ) ?? false
})
</script>

<template>
  <div class="gear-section" v-if="showCategory">

    <div class="apart header">
      <h2>{{ prettyCategory }}</h2>
      <button class="glass">+ Add</button>
    </div>

    <div
  v-for="gear in gears"
  :key="gear.name"
>
	<div class="gear-card" v-if="isMatchingInput(gear.name)">
		<div class="gear-main" @click="emits('changeOpenGear', gear.name)">
			<span>{{ gear.name }}</span>
			<span>{{ openGear === gear.name ? '−' : 'details +' }}</span>
		</div>

		<div v-if="openGear === gear.name">
			<small>{{ gear.notes || 'No notes' }}</small>
		</div>
	</div>
</div>

  </div>
</template>

<style scoped>
	div {
		grid-column: span 4;
	}

	button {
		padding: 0;
		padding-left: 4px;
		padding-right: 4px;
		border-radius: 4px;
	}
	.header {
		align-items: flex-end;
		border-bottom: 1px solid var(--husk-shadow);
	}

	.gear-section {
  display: flex;
  flex-direction: column;
  gap: 12px;

	background-color: oklch(from var(--pico-contrast) l c h / 0.4);
	border-radius: 12px;
	padding: 12px;
}

.header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.gear-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gear-card {
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--card-bg);
  box-shadow: var(--shadow-sm);
  transition: 0.15s ease;
}

.gear-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.gear-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>

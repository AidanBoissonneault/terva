<script lang="ts" setup>
import type { Gear, GearCategory } from '@/types';
import { computed } from 'vue';


const props = defineProps<{
	type: GearCategory
	gears: Gear[] | null
}>()

const prettyCategory = computed(() =>
	props.type
		.replace(/_/g, ' ')
		.replace(/\b\w/g, c => c.toUpperCase())
	)
</script>

<template>
  <div class="gear-section">

    <div class="apart header">
      <h2>{{ prettyCategory }}</h2>
      <button class="glass">+ Add</button>
    </div>

    <div class="gear-list">
      <div v-for="gear in gears" :key="gear.name" class="gear-card">

        <div class="gear-main">
          <span class="gear-name">{{ gear.name }}</span>

          <details>
            <summary>Details</summary>
            <p>{{ gear.notes || 'No notes' }}</p>
          </details>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
	div {
		grid-column: span 4;
	}
	table {
		grid-column: span 4;
	}
	.header {
		align-items: flex-end;
		border-bottom: 1px solid var(--husk-shadow);
	}

	.gear-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.gear-name {
  font-weight: 500;
}

details {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>

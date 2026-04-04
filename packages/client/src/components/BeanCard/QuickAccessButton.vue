<script setup lang="ts">
import { fetchTest } from '@/api/test.ts';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	text: string
}>()
</script>

<template>
  <button @click="fetchTest" class="glass big-text">
    <FontAwesomeIcon :icon="['fas', 'arrow-rotate-right']" class="recents-icon" />
    {{ text }}
  </button>
</template>

<style scoped>
button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
}

.recents-icon {
  opacity: 0.6;
  font-size: 0.65em;
  flex-shrink: 0;
  display: block;
}
</style>

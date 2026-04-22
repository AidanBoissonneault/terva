<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import { storeToRefs } from 'pinia'

const router = useRouter()
const errorStore = useErrorStore()
const { message, backRoute } = storeToRefs(errorStore)

function goBack() {
  errorStore.clear()
  router.push({ name: backRoute.value })
}
</script>

<template>
  <div class="error-view">
    <div class="error-card terva-card">
      <div class="icon">!</div>
      <p class="error-message">{{ message }}</p>
      <button class="glass" @click="goBack">Go back</button>
    </div>
  </div>
</template>

<style scoped>
.error-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 24px;
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  text-align: center;
  max-width: 320px;
  width: 100%;
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--red-500) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--red-500) 30%, transparent);
  color: var(--red-500);
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  color: var(--red-500);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

button {
  width: 100%;
}
</style>

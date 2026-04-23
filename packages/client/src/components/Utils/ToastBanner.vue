<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore, type ToastType } from '@/stores/toast'

const props = withDefaults(defineProps<{
  message?: string
  type?: ToastType
}>(), {
  message: '',
  type: undefined,
})

const toast = useToastStore()

const resolvedMessage = computed(() => props.message || toast.message || defaultMessages[resolvedType.value])
const resolvedType = computed<ToastType>(() => props.type ?? toast.type ?? 'success')

const defaultMessages: Record<ToastType, string> = {
  success: 'Done!',
  warning: 'Heads up.',
  error: 'Something went wrong.',
}

const config: Record<ToastType, { border: string; bg: string; text: string; icon: string }> = {
  success: {
    border: '#15803d',
    bg: '#dcfce7',
    text: '#14532d',
    icon: '✓',
  },
  warning: {
    border: '#c2410c',
    bg: '#ffedd5',
    text: '#7c2d12',
    icon: '⚠',
  },
  error: {
    border: '#b91c1c',
    bg: '#fee2e2',
    text: '#7f1d1d',
    icon: '✕',
  },
}

const current = computed(() => config[resolvedType.value])
</script>

<template>
  <div
    class="toast-banner"
    :style="{
      '--toast-border': current.border,
      '--toast-bg': current.bg,
      '--toast-text': current.text,
    }"
    role="alert"
    aria-live="assertive"
  >
    <span class="toast-icon" aria-hidden="true">{{ current.icon }}</span>
    <span class="toast-message">{{ resolvedMessage }}</span>
    <button class="toast-close" @click="toast.hide()" aria-label="Dismiss">✕</button>
  </div>
</template>

<style scoped>
.toast-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;

  display: flex;
  align-items: center;
  gap: 10px;

  background-color: var(--toast-bg);
  border: 2px solid var(--toast-border);
  border-top: none;
  border-radius: 0 0 24px 24px;
  padding: 12px 16px;

  color: var(--toast-text);
  font-size: 0.9rem;
  font-weight: 500;

  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.12),
    0 1px 4px rgba(0, 0, 0, 0.08);

  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { transform: translateY(-100%); }
  to   { transform: translateY(0); }
}

.toast-icon {
  font-size: 1rem;
  flex-shrink: 0;
  opacity: 0.85;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  all: unset;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 0.85rem;
  opacity: 0.45;
  padding: 2px 4px;
  border-radius: 50%;
  transition: opacity 0.15s ease;
  color: var(--toast-text);
  line-height: 1;
}

.toast-close:hover {
  opacity: 0.75;
}
</style>

// app store
// used for global app states that affect the app level.

// CREATED: 12APR2026
// BY: Aidan Boissonneault
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const refreshKey = ref(0);

  function refreshView() {
    refreshKey.value++;
  }

  return { refreshKey, refreshView };
});

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOnboardingStore = defineStore('onboarding', () => {
  const checked = ref(false)
  const show = ref(false)
  const step = ref(1)
  const userName = ref('')

  function init(hasOnboarded: boolean, currentStep: number, name: string) {
    checked.value = true
    userName.value = name
    if (!hasOnboarded) {
      show.value = true
      step.value = Math.max(1, Math.min(5, currentStep))
    }
  }

  function complete() {
    show.value = false
  }

  return { checked, show, step, userName, init, complete }
})

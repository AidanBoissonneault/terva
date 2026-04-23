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
    step.value = Math.max(1, Math.min(5, currentStep))
    if (!hasOnboarded) {
      show.value = true
    }
  }

  function complete() {
    show.value = false
    step.value = 5
  }

  return { checked, show, step, userName, init, complete }
})

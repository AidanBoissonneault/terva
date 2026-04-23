import axios from 'axios'
import type { CheckedJSON } from '@terva/shared'

export interface OnboardingStatus {
  has_onboarded: boolean
  onboarding_step: number
}

export const getOnboardingStatus = async (): Promise<CheckedJSON<OnboardingStatus>> => {
  try {
    const { data } = await axios.get('/api/onboarding')
    return { success: true, payload: data as OnboardingStatus }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export const saveOnboardingStep = async (step: number): Promise<void> => {
  await axios.put('/api/onboarding', { step }).catch(() => {
    // Non-critical — step resume is best-effort
  })
}

export const completeOnboarding = async (): Promise<CheckedJSON<{ ok: boolean }>> => {
  try {
    const { data } = await axios.post('/api/onboarding/complete')
    return { success: true, payload: data as { ok: boolean } }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

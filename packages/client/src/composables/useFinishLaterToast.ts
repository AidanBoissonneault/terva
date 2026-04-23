import { useToastStore } from '@/stores/toast'

const MESSAGES = [
  "Enjoy your coffee! We'll remind you to log it later. ☕",
  "Go ahead and sip — we'll nudge you to finish the log when you're ready. 🫖",
  "No rush! We'll remind you to log this one later.",
  "Take your time. Your brew log will be here when you get back!",
  "Savour every sip! We'll check in with you about the log later. ☕",
]

export function useFinishLaterToast() {
  const toast = useToastStore()

  function showFinishLaterToast() {
    toast.show(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]!, 'warning')
  }

  return { showFinishLaterToast }
}

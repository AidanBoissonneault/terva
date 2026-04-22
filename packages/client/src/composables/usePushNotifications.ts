import { ref } from 'vue'
import axios from 'axios'

const subscribed = ref(false)

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
	const rawData = atob(base64)
	const output = new Uint8Array(rawData.length)
	for (let i = 0; i < rawData.length; i++) {
		output[i] = rawData.charCodeAt(i)
	}
	return output
}

export function usePushNotifications() {
	async function subscribe() {
		if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

		try {
			const { data } = await axios.get<{ key: string | null }>('/api/push/vapid-public-key')
			if (!data.key) return

			const permission = await Notification.requestPermission()
			if (permission !== 'granted') return

			const registration = await navigator.serviceWorker.ready

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(data.key).buffer as ArrayBuffer,
			})

			await axios.post('/api/push/subscribe', subscription.toJSON(), { withCredentials: true })
			subscribed.value = true
		} catch (err) {
			console.error('Push subscription failed:', err)
		}
	}

	async function unsubscribe() {
		if (!('serviceWorker' in navigator)) return

		try {
			const registration = await navigator.serviceWorker.ready
			const subscription = await registration.pushManager.getSubscription()
			if (!subscription) return

			await axios.delete('/api/push/subscribe', {
				data: { endpoint: subscription.endpoint },
				withCredentials: true,
			})
			await subscription.unsubscribe()
			subscribed.value = false
		} catch (err) {
			console.error('Push unsubscribe failed:', err)
		}
	}

	async function checkSubscribed() {
		if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
		const registration = await navigator.serviceWorker.ready
		const subscription = await registration.pushManager.getSubscription()
		subscribed.value = !!subscription
	}

	return { subscribe, unsubscribe, checkSubscribed, subscribed }
}

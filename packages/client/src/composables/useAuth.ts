import { authClient } from '@/lib/auth-client'
import { invalidateSessionCache } from '@/router'

export function useAuth() {
	const session = authClient.useSession() // reactive Ref

	async function logout() {
		invalidateSessionCache()
		await authClient.signOut()
		window.location.href = '/login'
	}

	return {
		session, // session.data?.user, session.isPending, session.error
		user: session, // convenience alias
		logout,
	}
}

import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { authClient } from '@/lib/auth-client'
import UserDashboard from '@/views/UserDashboard.vue'

// uses inline loading on main route to load main route quicker
// uses lazy routing with alternate paths to speed up initial load.
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
		{ path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue') },

		{ path: '/', name: 'dashboard', component: UserDashboard, meta: { requiresAuth: true } },
		{ path: '/addbeans', name: 'addbeans', component: () => import('@/views/UserAddBeans.vue'), meta: { requiresAuth: true } },
		{ path: '/gear', name: 'gear', component: () => import('@/views/UserGear.vue'), meta: { requiresAuth: true } },
		{ path: '/profile', name: 'profile', component: () => import('@/views/UserProfile.vue'), meta: { requiresAuth: true } },
		{ path: '/about', name: 'about', component: () => import('@/views/UserAbout.vue'), meta: { requiresAuth: true } },
		{ path: '/more', name: 'more', component: () => import('@/views/UserMore.vue'), meta: { requiresAuth: true } },
		{ path: '/recipes', name: 'recipes', component: () => import('@/views/UserRecipes.vue'), meta: { requiresAuth: true } },
		{ path: '/brew/start', name: 'startbrew', component: () => import('@/views/StartBrew.vue'), meta: { requiresAuth: true } },
		{ path: '/brew/end', name: 'endbrew', component: () => import('@/views/EndBrew.vue'), meta: { requiresAuth: true } },
		{ path: '/beaninfo', name: 'beaninfo', component: () => import('@/views/UserBeanInfo.vue'), meta: { requiresAuth: true }},

		{ path: '/:pathMatch(.*)*', redirect: '/' },
	],
})

// starts a loading screen when a new page is loading
router.beforeEach(async (to) => {
	const loading = useLoadingStore()
	loading.start()

	if (!to.meta.requiresAuth) return true

	const session = await authClient.getSession()

	if (!session?.data?.user) {
		return { path: '/login' }
	}
})

// ends the loading screen when the new page is loaded
router.afterEach(() => {
	const loading = useLoadingStore()
	loading.stop()
})

export default router

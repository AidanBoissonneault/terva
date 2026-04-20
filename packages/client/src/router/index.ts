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
		{ path: '/forgot-password', name: 'forgotpassword', component: () => import('@/views/ForgotPassword.vue') },
		{ path: '/reset-password', name: 'resetpassword', component: () => import('@/views/ResetPassword.vue') },

		{ path: '/', name: 'dashboard', component: UserDashboard, meta: { requiresAuth: true } },
		{ path: '/bean', name: 'beaninfo', component: () => import('@/views/UserBeanInfo.vue'), meta: { requiresAuth: true }},
		{ path: '/bean/add', name: 'addbeans', component: () => import('@/views/UserAddBeans.vue'), meta: { requiresAuth: true } },
		{ path: '/bean/edit', name: 'editbean', component: () => import('@/views/UserEditBean.vue'), meta: { requiresAuth: true } },
		{ path: '/gear', name: 'gear', component: () => import('@/views/UserGear.vue'), meta: { requiresAuth: true } },
		{ path: '/profile', name: 'profile', component: () => import('@/views/UserProfile.vue'), meta: { requiresAuth: true } },
		{ path: '/profile/password', name: 'changepassword', component: () => import('@/views/ChangePassword.vue'), meta: { requiresAuth: true } },
		{ path: '/recipe', name: 'recipe', component: () => import('@/views/UserRecipes.vue'), meta: { requiresAuth: true } },
		{ path: '/recipe/add', name: 'addrecipe', component: () => import('@/views/UserAddRecipe.vue'), meta: { requiresAuth: true } },
		{ path: '/brew/start', name: 'startbrew', component: () => import('@/views/StartBrew.vue'), meta: { requiresAuth: true } },
		{ path: '/brew/with', name: 'brewwith', component: () => import('@/views/BrewWith.vue'), meta: { requiresAuth: true } },
		{ path: '/brew/end', name: 'endbrew', component: () => import('@/views/EndBrew.vue'), meta: { requiresAuth: true } },


		{ path: '/cookies', name: 'cookies', component: () => import('@/views/CookiePolicy.vue') },
		{ path: '/privacy', name: 'privacy', component: () => import('@/views/PrivacyPolicy.vue') },
		{ path: '/terms', name: 'terms', component: () => import('@/views/TermsAndCondtions.vue') },


		{ path: '/:pathMatch(.*)*', redirect: '/' },
	],
})

// starts a loading screen when a new page is loading
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedSession: any = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

router.beforeEach(async (to) => {
  const loading = useLoadingStore()
  loading.start()

  if (!to.meta.requiresAuth) return true

  const now = Date.now()
  if (!cachedSession || now - cacheTime > CACHE_TTL) {
    cachedSession = await authClient.getSession()
    cacheTime = now
  }

  if (!cachedSession?.data?.user) {
    cachedSession = null
    return { path: '/login' }
  }
})

// ends the loading screen when the new page is loaded
router.afterEach(() => {
	const loading = useLoadingStore()
	loading.stop()
})

export default router

export function invalidateSessionCache() {
  cachedSession = null
  cacheTime = 0
}

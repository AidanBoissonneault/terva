<script setup lang="ts">
import AppBar from './components/AppBar/AppBar.vue'
import TabBar from './components/TabBar/TabBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, provide, ref } from 'vue'
import type { Bean } from '@terva/shared'
import { useCurrentBeanStore } from './stores/currentShowcasedBean'
import { useAppStore } from './stores/app'
import FullscreenOverlay from './components/Utils/Overlay/FullscreenOverlay.vue'
import { removeBean } from './api/removeBean'
import { storeToRefs } from 'pinia'
import { useOptimisticRouterStore } from './stores/optimisticRouter'

const route = useRoute()
const router = useRouter()

const appStore = useAppStore()
const { refreshKey } = storeToRefs(appStore)

const optimisticRouter = useOptimisticRouterStore()
const { previousRoute, currentRoute } = storeToRefs(optimisticRouter)

// Tab order — must match TabBar.vue
const TAB_ROUTES = ['dashboard', 'gear', 'recipe', 'profile']

const transitionName = computed(() => {
	const from = previousRoute.value
	const to = currentRoute.value
	const fromIdx = TAB_ROUTES.indexOf(from)
	const toIdx = TAB_ROUTES.indexOf(to)

	// Both must be tab routes for a slide transition
	if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return 'steam'

	return toIdx > fromIdx ? 'tab-slide-left' : 'tab-slide-right'
})

const ignoredAppBarPages = ['startbrew', 'brewwith', 'endbrew']
const ignoreNavBarPages = ['login', 'register', 'cookies', 'terms', 'privacy', 'brewwith']
const isActiveAppBarPage = computed(() => !ignoredAppBarPages.includes(route.name as string))
const isActiveNavBarPage = computed(() => !ignoreNavBarPages.includes(route.name as string))

provide('beanEditClicked', (bean: Bean) => {
	const currentBean = useCurrentBeanStore()
	currentBean.set(bean)
	router.push({ name: 'editbean' })
})

const isWarnDeleteBean = ref<boolean>(false)
const deletedBean = ref<Bean>()

provide('beanDeleteClicked', (bean: Bean) => {
	deletedBean.value = bean
	isWarnDeleteBean.value = true
})

async function deleteSelectedBean() {
	isWarnDeleteBean.value = false
	await removeBean(deletedBean.value?.id ?? -1)

	if (route.name === 'dashboard')
		appStore.refreshView()

	router.push({ name: 'dashboard' })
}
</script>

<template>
	<div class="app-layout">
		<Transition name="slide-out-top" mode="out-in">
			<AppBar v-if="isActiveAppBarPage" />
		</Transition>

		<Transition :name="transitionName" mode="out-in">
			<main class="content" :class="{ shift_down: isActiveAppBarPage }" :key="route.fullPath">
				<router-view :key="refreshKey"/>
			</main>
		</Transition>

		<Transition name="slide-out-bottom" mode="out-in">
			<TabBar v-if="isActiveNavBarPage" />
		</Transition>
	</div>

	<FullscreenOverlay :is-visible="isWarnDeleteBean" @outside-clicked="isWarnDeleteBean = false; deletedBean = undefined">
				<div class="confirm-content">
				<p><strong>Delete {{ deletedBean?.name }}?</strong></p>
				<small>This permanently removes your bean and all brew data. This cannot be undone.</small>
				<div class="confirm-actions">
					<button class="glass danger" @click="deleteSelectedBean">Delete</button>
					<button class="glass" @click="isWarnDeleteBean = false">Cancel</button>
				</div>
			</div>
			</FullscreenOverlay>
</template>

<style scoped>
.app-layout {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.route-loading {
	position: fixed;
	inset: 0;

	display: flex;
	justify-content: center;
	align-items: center;

	z-index: 0;
}

.content {
	position: relative;
	overflow-y: visible;
	top: 24px;
	padding-bottom: 108px;

	z-index: 1;

	box-sizing: border-box;
	width: 100%;
}

.content.shift_down {
	top: 92px;
}

.confirm-content, strong {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.confirm-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 8px;
}

/* ── Default transition (steam) ─────────────────────────────── */
.steam-enter-active,
.steam-leave-active {
	transition: all 0.3s ease-out;
}

.steam-enter-from {
	opacity: 0;
	transform: translateY(12px);
	filter: blur(2px);
}

.steam-enter-to {
	opacity: 1;
	transform: translateY(0);
	filter: blur(0);
}

.steam-leave-from {
	opacity: 1;
	transform: translateY(0);
	filter: blur(0);
}

.steam-leave-to {
	opacity: 0;
	transform: translateY(-8px);
	filter: blur(2px);
}

/* ── Tab bar slide transitions ──────────────────────────────── */
.tab-slide-left-enter-active,
.tab-slide-left-leave-active,
.tab-slide-right-enter-active,
.tab-slide-right-leave-active {
	transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
	will-change: transform, opacity;
}

/* Navigating right (higher tab index): new page slides in from right */
.tab-slide-left-enter-from {
	transform: translateX(28px);
	opacity: 0;
}

.tab-slide-left-enter-to {
	transform: translateX(0);
	opacity: 1;
}

.tab-slide-left-leave-from {
	transform: translateX(0);
	opacity: 1;
}

.tab-slide-left-leave-to {
	transform: translateX(-28px);
	opacity: 0;
}

/* Navigating left (lower tab index): new page slides in from left */
.tab-slide-right-enter-from {
	transform: translateX(-28px);
	opacity: 0;
}

.tab-slide-right-enter-to {
	transform: translateX(0);
	opacity: 1;
}

.tab-slide-right-leave-from {
	transform: translateX(0);
	opacity: 1;
}

.tab-slide-right-leave-to {
	transform: translateX(28px);
	opacity: 0;
}

/* ── AppBar / TabBar mount/unmount ──────────────────────────── */
.slide-out-bottom-enter-active,
.slide-out-bottom-leave-active,
.slide-out-top-enter-active,
.slide-out-top-leave-active {
	transition: transform 0.3s ease, opacity 0.25s ease;
	will-change: transform, opacity;
}

.slide-out-bottom-enter-from {
	transform: translateY(100%);
	opacity: 0;
}

.slide-out-top-enter-from {
	transform: translateY(-100%);
	opacity: 0;
}

.slide-out-bottom-enter-to,
.slide-out-top-enter-to {
	transform: translateY(0);
	opacity: 1;
}

.slide-out-bottom-leave-from,
.slide-out-top-leave-from {
	transform: translateY(0);
	opacity: 1;
}

.slide-out-bottom-leave-to {
	transform: translateY(100%);
	opacity: 0;
}

.slide-out-top-leave-to {
	transform: translateY(-100%);
	opacity: 0;
}
</style>

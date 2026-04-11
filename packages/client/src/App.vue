<script setup lang="ts">
import AppBar from './components/AppBar/AppBar.vue'
import PourOverLoader from './components/Utils/PourOverLoader.vue'
import TabBar from './components/TabBar/TabBar.vue'
import { useLoadingStore } from '@/stores/loading'
import { useRoute, useRouter } from 'vue-router'
import { computed, provide, ref } from 'vue'
import type { Bean } from '@terva/shared'
import { useCurrentBeanStore } from './stores/currentShowcasedBean'
import FullscreenOverlay from './components/Utils/Overlay/FullscreenOverlay.vue'
import { removeBean } from './api/removeBean'

const loading = useLoadingStore()
const route = useRoute()
const router = useRouter()

const ignoredAppBarPages = ['startbrew', 'endbrew']
const ignoreNavBarPages = ['endbrew', 'login', 'register', 'cookies', 'terms', 'privacy']
const isActiveAppBarPage = computed(() => !ignoredAppBarPages.includes(route.name as string))
const isActiveNavBarPage = computed(() => !ignoreNavBarPages.includes(route.name as string))

// routes when bean card's edit button is pressed to the Bean Edit screen.

provide('beanEditClicked', (bean: Bean) => {
	const currentBean = useCurrentBeanStore()
	currentBean.set(bean)
	router.push({ name: 'editbean' })
})

// stores if the Delete Bean warning is being shown.
const isWarnDeleteBean = ref<boolean>(false)

// stores the bean the user is attempting to delete
const deletedBean = ref<Bean>()

provide('beanDeleteClicked', (bean: Bean) => {
	deletedBean.value = bean
	isWarnDeleteBean.value = true
})

async function deleteSelectedBean() {
	isWarnDeleteBean.value = false
	await removeBean(deletedBean.value?.id ?? -1)

	router.push({ name: 'dashboard' })
}
</script>

<template>
	<div class="app-layout">
		<Transition name="slide-out-top" mode="out-in">
			<AppBar v-if="isActiveAppBarPage" />
		</Transition>

		<Transition name="steam" mode="out-in">
			<main class="content" :class="{ shift_down: isActiveAppBarPage }" :key="route.fullPath">
				<router-view />
			</main>
		</Transition>

		<Transition name="slide-out-bottom" mode="out-in">
			<TabBar v-if="isActiveNavBarPage" />
		</Transition>

		<div v-if="loading.isRouteLoading" class="route-loading">
			<PourOverLoader />
		</div>
	</div>

	<FullscreenOverlay :is-visible="isWarnDeleteBean" @outside-clicked="isWarnDeleteBean = false; deletedBean = undefined">
				<div class="confirm-content">
				<p><strong>Delete {{ deletedBean?.name }}?</strong></p>
				<small>This permanently removes your bean and all brew data. This cannot be undone.</small>
				<div class="confirm-actions">
					<button class="glass" @click="isWarnDeleteBean = false">Cancel</button>
					<button class="glass danger-btn" @click="deleteSelectedBean">Delete</button>
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
	padding-bottom: 96px;

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

	color: var(--pico-primary-inverse);
}

.confirm-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 8px;
}

.danger-btn {
	border-color: oklch(from var(--red-500) l c h / 0.5) !important;
	color: var(--red-400) !important;
}

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

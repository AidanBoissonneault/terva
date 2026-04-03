<script setup lang="ts">
import AppBar from './components/AppBar/AppBar.vue'
import PourOverLoader from './components/Utils/PourOverLoader.vue'
import TabBar from './components/TabBar/TabBar.vue'
import { useLoadingStore } from '@/stores/loading'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const loading = useLoadingStore()
const route = useRoute()

const ignoredAppBarPages = ['startbrew', 'beaninfo']
const isActiveAppBarPage = computed(() => !ignoredAppBarPages.includes(route.name as string))
</script>

<template>
	<div class="app-layout">
		<AppBar v-if="isActiveAppBarPage"/>

		<Transition name="steam" mode="out-in">
			<main class="content" :class="{ shift_down: isActiveAppBarPage }" :key="route.fullPath">
				<router-view />
			</main>
		</Transition>

		<TabBar />

		<div v-if="loading.isRouteLoading" class="route-loading">
			<PourOverLoader />
		</div>
	</div>
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
	padding-bottom: 110px;

	z-index: 1;

	box-sizing: border-box;
  width: 100%;
}

.content.shift_down {
top: 100px;
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
</style>

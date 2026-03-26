<script setup lang="ts">
import PlusButton from './PlusButton.vue'
import ProfileIcon from './ProfileIcon.vue'

import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const ignorePlusButton = <string[]>['addbeans']
const isDisplayPage = computed(() => !ignorePlusButton.includes(route.name as string))

function navigate(route: string) {
	router.push({ name: route });
}

const activePage = computed(() => route.name?.toString().toLowerCase() ?? '')
</script>

<template>
	<TransitionGroup name="slide" tag="header">
		<PlusButton v-if="isDisplayPage" :key="1" @navigate="navigate" route="addbeans" :active-route="activePage"/>
		<img v-else src="@/assets/images/title-image.PNG" alt="" />
		<h1 :key="2">Terva</h1>
		<ProfileIcon :key="3" />
	</TransitionGroup>
</template>

<style scoped>
header {
	position: fixed;
	width: calc(100% - (2 * var(--bar-margin)));
	height: auto;

	background: linear-gradient(to bottom,
			oklch(from var(--husk-app-bar-accent) l c h / 0.25),
			oklch(from var(--husk-app-bar-accent) l c h / 0.20));
	background-color: oklch(from var(--husk-app-bar) l c h / 0.6);
	border: 1px solid oklch(from var(--husk-app-bar-border) l c h / 0.25);

	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);

	margin-top: 20px;
	margin-left: var(--bar-margin);
	margin-right: var(--bar-margin);
	margin-bottom: 12px;
	padding-left: 24px;
	padding-right: 24px;
	padding-top: 10px;
	padding-bottom: 10px;

	display: flex;
	align-items: center;
	justify-content: space-between;

	box-shadow:
		0 8px 24px oklch(from var(--husk-shadow) l c h / 0.4),
		inset 0 1px 0 oklch(from var(--husk-highlight) l c h / 0.4);

	border-radius: 12px;
	z-index: 99999;
}

img {
	width: 48px;
	height: 48px;
}

h1 {
	text-shadow: 0px 1px var(--brand-500);
	padding: 0;
	margin: 0;
	font-family: 'Camela';
  font-weight: 500;

	--pico-font-size: 2.5rem;
	--pico-line-height: 1.125;
	--pico-typography-spacing-top: 3rem;
}

.slide-move {
	transition: transform 0.25s ease;
}

.slide-enter-active,
.slide-leave-active {
	transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
	opacity: 0;
	transform: scale(0.9);
}

.slide-leave-active {
	position: absolute;
}
</style>

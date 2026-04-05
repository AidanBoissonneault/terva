<script setup lang="ts">
import PlusButton from './PlusButton.vue'

import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()

const ignorePlusButton = <string[]>['addbeans', 'login', 'register']
const isDisplayPage = computed(() => !ignorePlusButton.includes(route.name as string))

function navigate(route: string) {
  router.push({ name: route })
}

const activePage = computed(() => route.name?.toString().toLowerCase() ?? '')

const isHidden = ref(false)
let lastScrollY = 0

function onScroll() {
  const currentY = window.scrollY
  isHidden.value = currentY > lastScrollY && currentY > 150
  lastScrollY = currentY
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <TransitionGroup name="swap" tag="header" :class="{ hidden: isHidden }">
    <h1 :key="2">Terva</h1>
    <PlusButton v-if="isDisplayPage" :key="1" @navigate="navigate" route="addbeans" :active-route="activePage" />
    <img v-else :key="3" src="@/assets/images/title-image.PNG" alt="" />
  </TransitionGroup>
</template>

<style scoped>
header {
  position: fixed;
  width: calc(100% - (2 * var(--bar-margin)));

  background: linear-gradient(to bottom,
      oklch(from var(--husk-app-bar-accent) l c h / 0.25),
      oklch(from var(--husk-app-bar-accent) l c h / 0.20));
  background-color: oklch(from var(--husk-app-bar) l c h / 0.6);
  border: 1px solid oklch(from var(--husk-app-bar-border) l c h / 0.25);

  backdrop-filter: blur(8px) saturate(1.4);
  -webkit-backdrop-filter: blur(8px) saturate(1.4);

  margin-top: 20px;
  margin-left: var(--bar-margin);
  margin-right: var(--bar-margin);
  margin-bottom: 12px;
	padding: 8px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  box-shadow:
    0 8px 24px oklch(from var(--husk-shadow) l c h / 0.4),
    inset 0 1px 0 oklch(from var(--husk-highlight) l c h / 0.4);

  border-radius: 12px;
  z-index: 99999;

  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

header.hidden {
  transform: translateY(calc(-100% - 32px));
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

.swap-enter-active,
.swap-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.swap-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.swap-enter-to {
  opacity: 1;
  transform: scale(1);
}

.swap-leave-from {
  opacity: 1;
  transform: scale(1);
}

.swap-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.swap-leave-active {
  position: absolute;
  right: 24px;
}
</style>

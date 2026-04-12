<!--
DropdownMenu
A reusable positioned dropdown shell.
Accepts a trigger slot (the button that opens it) and a default slot
(the menu items). Handles positioning, click-outside, keyboard, scroll,
and a shared singleton so only one menu is open at a time.

CREATED: 12APR2026
By: Aidan Boissonneault
-->

<script lang="ts">
// Module-level singleton so only one dropdown is open at a time
const activeMenuId = ref<string | null>(null)
export { activeMenuId }
</script>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watchEffect } from 'vue'

const id = crypto.randomUUID()

const open = ref(false)
const ready = ref(false)

const root = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const dropdownStyle = ref<Record<string, string>>({})

const props = defineProps<{
	menuWidth?: number
	menuHeight?: number
}>()

function updatePosition() {
	if (!root.value) return

	const rect = root.value.getBoundingClientRect()
	const menuWidth = props.menuWidth ?? 160
	const menuHeight = props.menuHeight ?? 100
	const PADDING = 8

	let top = rect.bottom + 6
	let left = rect.right - menuWidth

	if (left < PADDING) left = PADDING
	if (left + menuWidth > window.innerWidth - PADDING) {
		left = window.innerWidth - menuWidth - PADDING
	}
	if (top + menuHeight > window.innerHeight - PADDING) {
		top = rect.top - menuHeight - 6
	}

	dropdownStyle.value = {
		position: 'fixed',
		top: `${top}px`,
		left: `${left}px`,
		zIndex: '9999',
	}
}

function toggle() {
	const isOpening = activeMenuId.value !== id
	activeMenuId.value = isOpening ? id : null
	open.value = isOpening

	if (open.value) {
		ready.value = false
		nextTick(() => {
			updatePosition()
			requestAnimationFrame(() => {
				ready.value = true
				menuRef.value?.focus({ preventScroll: true })
			})
		})
	}
}

function close() {
	if (activeMenuId.value === id) activeMenuId.value = null
	open.value = false
}

// Close when another menu opens
watchEffect(() => {
	if (activeMenuId.value !== id && open.value) open.value = false
})

function handleClickOutside(e: MouseEvent) {
	const target = e.target as Node
	if (root.value?.contains(target)) return
	if (menuRef.value?.contains(target)) return
	close()
}

function handleKey(e: KeyboardEvent) {
	if (e.key === 'Escape') close()
}

function handleFocusIn(e: FocusEvent) {
	const target = e.target as Node
	if (root.value?.contains(target)) return
	if (menuRef.value?.contains(target)) return
	if (open.value) close()
}

function handleScroll() {
	if (open.value) close()
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
	document.addEventListener('keydown', handleKey)
	document.addEventListener('focusin', handleFocusIn)
	window.addEventListener('scroll', handleScroll, true)
	window.addEventListener('resize', handleScroll)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
	document.removeEventListener('keydown', handleKey)
	document.removeEventListener('focusin', handleFocusIn)
	window.removeEventListener('scroll', handleScroll, true)
	window.removeEventListener('resize', handleScroll)
})

defineExpose({ toggle, close })
</script>

<template>
	<div ref="root" class="dropdown-wrapper">
		<!-- Trigger slot: whatever button the parent wants -->
		<slot name="trigger" :toggle="toggle" :open="open" />

		<Teleport to="body">
			<Transition name="dropdown">
				<div
					v-if="open && ready"
					ref="menuRef"
					class="dropdown-menu"
					:style="{ ...dropdownStyle, minWidth: (props.menuWidth ?? 160) + 'px' }"
					tabindex="-1"
					role="menu"
				>
					<slot :close="close" />
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style scoped>
.dropdown-wrapper {
	display: inline-block;
	position: relative;
}

.dropdown-menu {
	padding: 0.35rem;

	border-radius: var(--pico-border-radius);
	background: rgba(30, 30, 30, 0.85);
	backdrop-filter: blur(10px);

	border: 1px solid rgba(255, 255, 255, 0.08);

	box-shadow:
		0 10px 30px rgba(0, 0, 0, 0.25),
		0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-enter-active,
.dropdown-leave-active {
	transition:
		opacity 0.16s ease,
		transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: scale(0.94) translateY(-4px);
}

.dropdown-enter-to,
.dropdown-leave-from {
	opacity: 1;
	transform: scale(1) translateY(0);
}
</style>

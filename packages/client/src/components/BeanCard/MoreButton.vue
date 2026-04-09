<script lang="ts">
const activeMenuId = ref<string | null>(null)
</script>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Bean } from '@terva/shared';
import { ref, onMounted, onBeforeUnmount, nextTick, watchEffect, inject } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	bean: Bean
}>()

const id = crypto.randomUUID()

const open = ref(false)
const ready = ref(false)

const root = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const dropdownStyle = ref<Record<string, string>>({})

function updatePosition() {
	if (!buttonRef.value) return

	const rect = buttonRef.value.getBoundingClientRect()

	const menuWidth = 160
	const menuHeight = (140 / 3 * 2)
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

watchEffect(() => {
	if (activeMenuId.value !== id && open.value) open.value = false
})

function handleClickOutside(e: MouseEvent) {
	if (!root.value) return
	if (!root.value.contains(e.target as Node)) close()
}

function handleKey(e: KeyboardEvent) {
	if (e.key === 'Escape') close()
}

function handleFocusIn(e: FocusEvent) {
	if (!root.value) return
	if (!root.value.contains(e.target as Node) && open.value) close()
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

const beanEditClicked = inject<(bean: Bean) => void>('beanEditClicked')
const beanDeleteClicked = inject<(bean: Bean) => void>('beanDeleteClicked')
</script>

<template>
	<div ref="root" class="more-wrapper">
		<button
			ref="buttonRef"
			class="more-button"
			aria-haspopup="menu"
			:aria-expanded="open"
			@click.stop="toggle"
		>
			<FontAwesomeIcon class="icon" :icon="['fas', 'ellipsis-vertical']" />
		</button>

		<Teleport to="body">
			<transition name="dropdown">
				<div
					v-if="open && ready"
					ref="menuRef"
					class="dropdown"
					:style="dropdownStyle"
					tabindex="-1"
					role="menu"
				>
					<button class="dropdown-item" @click="beanEditClicked?.(bean)">
						<FontAwesomeIcon class="dropdown-icon" :icon="['fas', 'pen']" />
						<span>Edit</span>
					</button>

					<div class="divider"></div>

					<button class="dropdown-item danger" @click="beanDeleteClicked?.(bean)">
						<FontAwesomeIcon class="dropdown-icon" :icon="['fas', 'trash']" />
						<span>Delete</span>
					</button>
				</div>
			</transition>
		</Teleport>
	</div>
</template>

<style scoped>
.more-wrapper {
	display: inline-block;
	width: 32px;
	height: 24px;
	position: relative;
}

.more-button {
	width: 100%;
	height: 100%;

	padding: 0;
	margin: 0;

	background: none;
	border: none;

	display: block;
	cursor: pointer;

	outline: none !important;
	box-shadow: none !important;
}

.more-button:focus,
.more-button:focus-visible,
.more-button:focus-within {
	outline: none !important;
	box-shadow: none !important;
}

.icon {
	width: 16px;
	height: 16px;

	display: block;
	position: absolute;

	top: 0;
	left: 50%;
	transform: translateX(-50%);

	color: white;
	pointer-events: none;
}

.dropdown {
	min-width: 160px;
	padding: 0.35rem;

	border-radius: var(--pico-border-radius);
	background: rgba(30, 30, 30, 0.85);
	backdrop-filter: blur(10px);

	border: 1px solid rgba(255, 255, 255, 0.08);

	box-shadow:
		0 10px 30px rgba(0, 0, 0, 0.25),
		0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
	display: flex;
	align-items: center;
	gap: 0.55rem;

	width: 100%;
	text-align: left;

	padding: 0.5rem 0.65rem;
	border-radius: calc(var(--pico-border-radius) - 2px);

	background: transparent;
	border: none;
	color: var(--pico-h2-color);

	cursor: pointer;
	transition: transform 0.08s ease;
}

.dropdown-item:hover {
	background: var(--pico-muted-border-color);
}

.dropdown-item:active {
	transform: scale(0.97);
}

.dropdown-item.danger {
	color: var(--pico-del-color);
}

.dropdown-icon {
	width: 14px;
	opacity: 0.8;
}

.divider {
	height: 1px;
	margin: 0.3rem 0.2rem;
	background: var(--pico-muted-border-color);
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

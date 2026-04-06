<script setup lang="ts">
import { watch, nextTick, ref } from 'vue'

const props = defineProps<{
	modelValue: boolean
	title?: string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: boolean]
}>()

const visible = ref(false)
const animating = ref(false)

watch(
	() => props.modelValue,
	async (val) => {
		if (val) {
			visible.value = true
			await nextTick()
			animating.value = true
		} else {
			animating.value = false
			setTimeout(() => {
				visible.value = false
			}, 380)
		}
	}
)

function close() {
	emit('update:modelValue', false)
}

function onBackdropClick(e: MouseEvent) {
	if (e.target === e.currentTarget) close()
}
</script>

<template>
	<Teleport to="body">
		<div v-if="visible" class="bottom-sheet-backdrop" :class="{ active: animating }" @click="onBackdropClick">
			<div class="bottom-sheet" :class="{ active: animating }" role="dialog" aria-modal="true">
				<div class="bottom-sheet-header">
					<span v-if="title" class="bottom-sheet-title">{{ title }}</span>
					<button class="bottom-sheet-close" @click="close" aria-label="Close">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				<!-- Scrollable content slot -->
				<div class="bottom-sheet-body">
					<slot />
				</div>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.bottom-sheet-backdrop {
	position: fixed;
	inset: 0;
	z-index: 99999999999;
	display: flex;
	align-items: flex-end;

	background: oklch(0% 0 0 / 0);
	backdrop-filter: blur(0px);
	-webkit-backdrop-filter: blur(0px);
	transition:
		background 0.35s ease,
		backdrop-filter 0.35s ease;
}

.bottom-sheet-backdrop.active {
	background: oklch(0% 0 0 / 0.45);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
}

.bottom-sheet {
	width: 100%;
	max-height: 90dvh;
	display: flex;
	flex-direction: column;

	background: color-mix(in oklch, var(--pico-background-color, #1a1a1a) 72%, transparent);
	backdrop-filter: blur(24px) saturate(1.6);
	-webkit-backdrop-filter: blur(24px) saturate(1.6);

	border-top: 1px solid oklch(100% 0 0 / 0.08);
	border-radius: 20px 20px 0 0;
	box-shadow:
		0 -8px 40px oklch(0% 0 0 / 0.3),
		0 -1px 0 oklch(100% 0 0 / 0.06) inset;

	transform: translateY(100%);
	transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
}

.bottom-sheet.active {
	transform: translateY(0);
}

.bottom-sheet::before {
	content: '';
	display: block;
	width: 36px;
	height: 4px;
	border-radius: 2px;
	background: oklch(100% 0 0 / 0.18);
	margin: 12px auto 0;
	flex-shrink: 0;
}

.bottom-sheet-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px 12px;
	flex-shrink: 0;
	border-bottom: 1px solid oklch(100% 0 0 / 0.06);
}

.bottom-sheet-title {
	font-size: 0.8rem;
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--pico-muted-color, oklch(65% 0 0));
}

.bottom-sheet-close {
	all: unset;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	color: var(--pico-muted-color, oklch(65% 0 0));
	background: oklch(100% 0 0 / 0);
	transition:
		background 0.15s ease,
		color 0.15s ease;
	margin-left: auto;
}

.bottom-sheet-close:hover {
	background: oklch(100% 0 0 / 0.08);
	color: var(--pico-color, oklch(90% 0 0));
}

.bottom-sheet-close:active {
	background: oklch(100% 0 0 / 0.14);
}

.bottom-sheet-body {
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: 20px 24px 40px;
	flex: 1;

	mask-image: linear-gradient(to bottom, transparent 0%, black 24px);
}

.bottom-sheet-body::-webkit-scrollbar {
	width: 4px;
}

.bottom-sheet-body::-webkit-scrollbar-track {
	background: transparent;
}

.bottom-sheet-body::-webkit-scrollbar-thumb {
	background: oklch(100% 0 0 / 0.15);
	border-radius: 2px;
}
</style>

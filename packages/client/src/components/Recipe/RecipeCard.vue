<script setup lang="ts">
import type { Recipe } from '@terva/shared'
import { ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	recipe: Recipe
}>()

const emits = defineEmits<{
	deleteRequested: [id: number, name: string]
	editRequested: [recipe: Recipe]
}>()

const expanded = ref(false)

function formatDuration(seconds: number): string {
	if (seconds < 60) return `${seconds}s`
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function totalDuration(recipe: Recipe): string {
	const total = recipe.steps.reduce((acc, s) => acc + s.duration, 0)
	return formatDuration(total)
}
</script>

<template>
	<article class="recipe-card" :class="{ expanded }">
		<div class="recipe-header apart" @click="expanded = !expanded">
			<div class="recipe-meta">
				<strong class="recipe-name">{{ recipe.name }}</strong>
				<small class="recipe-sub">
					<span class="method-badge">{{ recipe.brewMethod }}</span>
					<span class="dot">·</span>
					<span>{{ recipe.steps.length }} steps</span>
					<span class="dot">·</span>
					<span>{{ totalDuration(recipe) }}</span>
				</small>
			</div>
			<div class="recipe-actions" @click.stop>
				<button
					class="glass secondary icon-btn"
					@click="emits('editRequested', recipe)"
					aria-label="Edit recipe"
				>✎</button>
				<button
					class="glass secondary icon-btn delete-btn"
					@click="emits('deleteRequested', recipe.id, recipe.name)"
					aria-label="Delete recipe"
				>✕</button>
				<button class="glass icon-btn chevron-btn" @click="expanded = !expanded" aria-label="Toggle steps">
					<span class="chevron" :class="{ open: expanded }">›</span>
				</button>
			</div>
		</div>

		<Transition name="steps-expand">
			<ol v-if="expanded" class="steps-list">
				<li v-for="step in recipe.steps" :key="step.id" class="step-item">
					<span class="step-action">{{ step.action }}</span>
					<span class="step-duration">{{ formatDuration(step.duration) }}</span>
				</li>
			</ol>
		</Transition>
	</article>
</template>

<style scoped>
.recipe-card {
	grid-column: span 4;
	padding: 14px 16px;
	border-radius: var(--pico-border-radius);
	background-color: oklch(from var(--terva-app-bar) l c h / 0.3);
	border: 1px solid oklch(from var(--terva-app-bar-border) l c h / 0.18);
	cursor: pointer;
	transition: border-color 0.15s ease;
}

.recipe-card.expanded {
	border-color: oklch(from var(--pico-primary) l c h / 0.35);
}

.recipe-header {
	align-items: center;
	gap: 10px;
}

.recipe-meta {
	display: flex;
	flex-direction: column;
	gap: 3px;
	flex: 1;
	min-width: 0;
}

.recipe-name {
	font-size: 0.95rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.recipe-sub {
	display: flex;
	align-items: center;
	gap: 5px;
	opacity: 0.6;
	flex-wrap: wrap;
}

.method-badge {
	background-color: oklch(from var(--pico-primary) l c h / 0.15);
	color: var(--pico-primary);
	padding: 1px 7px;
	border-radius: 999px;
	font-size: 0.75rem;
	font-weight: 600;
}

.dot {
	opacity: 0.4;
}

.recipe-actions {
	display: flex;
	gap: 6px;
	flex-shrink: 0;
}

.icon-btn {
	width: 32px;
	height: 32px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.85rem;
	border-radius: calc(var(--pico-border-radius) * 0.6);
}

.icon-btn.secondary {
	color: var(--pico-muted-color);
	border-color: oklch(from var(--pico-muted-color) l c h / 0.2);
}

.delete-btn {
	color: var(--red-500) !important;
	border-color: oklch(from var(--red-500) l c h / 0.3) !important;
}

.chevron {
	display: inline-block;
	font-size: 1.2rem;
	line-height: 1;
	transition: transform 0.2s ease;
	transform: rotate(0deg);
}

.chevron.open {
	transform: rotate(90deg);
}

/* Steps list */

.steps-list {
	margin: 12px 0 0 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 6px;
	border-top: 1px solid oklch(from var(--terva-app-bar-border) l c h / 0.12);
	padding-top: 12px;
	counter-reset: step-counter;
}

.step-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	font-size: 0.875rem;
	counter-increment: step-counter;
}

.step-item::before {
	content: counter(step-counter);
	font-size: 0.7rem;
	font-weight: 600;
	opacity: 0.3;
	min-width: 16px;
	text-align: center;
}

.step-action {
	flex: 1;
}

.step-duration {
	opacity: 0.5;
	font-size: 0.8rem;
	white-space: nowrap;
	font-variant-numeric: tabular-nums;
}

/* Transition */

.steps-expand-enter-active,
.steps-expand-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.steps-expand-enter-from,
.steps-expand-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>

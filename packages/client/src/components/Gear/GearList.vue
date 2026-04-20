<!--
GearList
Displays all gear of a given category as collapsible cards.
Matches the RecipeCard style. Emits edit/remove up to the parent.

CREATED: 27MAR2026
LAST EDITED: 12APR2026
By: Aidan Boissonneault
-->

<script lang="ts" setup>
import type { Gear, GearCategory } from '@terva/shared'
import { computed, ref } from 'vue'
import TervaCardSkeleton from '@/components/Skeleton/TervaCardSkeleton.vue'

const props = defineProps<{
	type: GearCategory
	gears: Gear[] | null
	search: string
	loading: boolean
}>()

const emits = defineEmits<{
	createNewGear: [GearCategory]
	removeGear: [number, string]
	editGear: [Gear]
}>()

const expandedId = ref<number | null>(null)

const prettyCategory = computed(() =>
	props.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
)

const categoryMatches = computed(() => {
	if (!props.search) return false
	return prettyCategory.value.toLowerCase().includes(props.search)
})

function isMatchingInput(name: string) {
	if (categoryMatches.value) return true
	return name.toLowerCase().includes(props.search)
}

const showCategory = computed(() => {
	if (!props.search) return true
	return props.gears?.some((g) => isMatchingInput(g.name)) ?? false
})

function toggleExpand(id: number) {
	expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
	<div class="gear-section" v-if="showCategory">
		<!-- Section header -->
		<div class="section-header apart">
			<h4 class="section-title">{{ prettyCategory }}</h4>
			<button class="glass small" @click="emits('createNewGear', type)">+ Add</button>
		</div>

		<template v-if="loading">
			<!-- still loading -->
			<TervaCardSkeleton v-for="i in 2" :key="i" />
		</template>
		<template v-else-if="gears?.length === 0">
			<p class="empty-label">No {{ prettyCategory.toLowerCase() }} added yet.</p>
		</template>
		<template v-else>
			<!-- Gear cards -->
			<template v-for="gear in gears" :key="gear.id">
				<article
					v-if="isMatchingInput(gear.name)"
					class="terva-card gear-card"
					:class="{ expanded: expandedId === gear.id }"
				>
					<div class="card-header apart" @click="toggleExpand(gear.id)">
						<strong class="gear-name">{{ gear.name }}</strong>
						<div class="card-actions" @click.stop>
							<button
								class="glass secondary icon-btn"
								@click="emits('editGear', gear)"
								aria-label="Edit gear"
							>
								✎
							</button>
							<button
								class="glass secondary icon-btn delete-btn"
								@click="emits('removeGear', gear.id, gear.name)"
								aria-label="Delete gear"
							>
								✕
							</button>
							<button
								class="glass icon-btn"
								@click="toggleExpand(gear.id)"
								aria-label="Toggle notes"
							>
								<span class="chevron" :class="{ open: expandedId === gear.id }">›</span>
							</button>
						</div>
					</div>

					<Transition name="expand">
						<div v-if="expandedId === gear.id" class="gear-notes">
							<p>{{ gear.notes || 'No notes.' }}</p>
						</div>
					</Transition>
				</article>
			</template>
		</template>
	</div>
</template>

<style scoped>
.gear-section {
	grid-column: span 4;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.section-header {
	align-items: center;
	margin-bottom: 2px;
}

.section-title {
	margin: 0;
	font-size: 0.8rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	opacity: 0.5;
	font-weight: 600;
}

.empty-label {
	font-size: 0.85rem;
	opacity: 0.4;
	margin: 0;
	padding: 4px 0;
}

/* Card */

.gear-card {
	cursor: pointer;
}

.card-header {
	align-items: center;
	gap: 10px;
}

.gear-name {
	font-size: 0.95rem;
	flex: 1;
	min-width: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.card-actions {
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
}

.chevron.open {
	transform: rotate(90deg);
}

/* Notes expand */

.gear-notes {
	border-top: 1px solid oklch(from var(--terva-app-bar-border) l c h / 0.12);
	margin-top: 10px;
	padding-top: 10px;
}

.gear-notes p {
	margin: 0;
	font-size: 0.875rem;
	opacity: 0.65;
}

/* Transitions */

.expand-enter-active,
.expand-leave-active {
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>

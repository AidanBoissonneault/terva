<!--
TervaCardSkeleton
Generic skeleton placeholder that mimics a terva-card shell.
Used on recipe and gear screens while data loads.

Props:
  height  – card height in px (default 52, matches the collapsed
             recipe/gear card with one row of content + action buttons)
  lines   – how many shimmer lines to render inside (default 1)

CREATED ON: 17APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
defineProps<{
	height?: number
	lines?: number
}>()
</script>

<template>
	<div
		class="terva-card-skeleton terva-card"
		:style="height ? { minHeight: height + 'px' } : {}"
	>
		<!-- mimics the header row: name on left, action buttons on right -->
		<div class="skel-header">
			<div class="skel skel-title" />
			<div class="skel-actions">
				<div class="skel skel-btn-icon" />
				<div class="skel skel-btn-icon" />
				<div class="skel skel-btn-icon" />
			</div>
		</div>

		<!-- optional extra lines (e.g. recipe sub-line) -->
		<template v-if="lines && lines > 1">
			<div
				v-for="i in lines - 1"
				:key="i"
				class="skel skel-line"
				:style="{ width: (70 - i * 12) + '%', marginTop: '8px' }"
			/>
		</template>
	</div>
</template>

<style scoped>
.terva-card-skeleton {
	grid-column: span 4;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

/*  shimmer base  */
@keyframes shimmer {
	0%   { background-position: -200% center; }
	100% { background-position:  200% center; }
}

.skel {
	border-radius: 4px;
	background: linear-gradient(
		90deg,
		oklch(from var(--neutral-700) l c h / 0.5) 25%,
		oklch(from var(--neutral-600) l c h / 0.6) 50%,
		oklch(from var(--neutral-700) l c h / 0.5) 75%
	);
	background-size: 200% 100%;
	animation: shimmer 1.6s ease-in-out infinite;
	height: 14px;
}

/*  layout  */
.skel-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
}

.skel-title {
	width: 45%;
	height: 16px;
}

.skel-actions {
	display: flex;
	gap: 6px;
	flex-shrink: 0;
}

.skel-btn-icon {
	width: 32px;
	height: 32px;
	border-radius: calc(var(--pico-border-radius) * 0.6);
	background: linear-gradient(
		90deg,
		oklch(from var(--neutral-700) l c h / 0.5) 25%,
		oklch(from var(--neutral-600) l c h / 0.6) 50%,
		oklch(from var(--neutral-700) l c h / 0.5) 75%
	);
	background-size: 200% 100%;
	animation: shimmer 1.6s ease-in-out infinite;
}

.skel-line {
	height: 13px;
}
</style>

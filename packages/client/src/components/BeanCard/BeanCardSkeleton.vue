<!--
BeanCardSkeleton
Skeleton placeholder shown while bean data is loading.
Mirrors the visual shape of BeanCard / HeroBeanCard.

CREATED: 16APR2026
By: Aidan Boisonneault
-->

<script setup lang="ts">
defineProps<{
	hero?: boolean
}>()
</script>

<template>
	<div class="bean-card-skeleton" :class="{ hero }">
		<!-- top row: name + badge -->
		<div class="skeleton-row apart">
			<div class="skel skel-name" />
			<div class="skel skel-badge" />
		</div>

		<!-- roaster row -->
		<div class="skeleton-row apart mt-xs">
			<div class="skel skel-roast" />
			<div class="skel skel-roaster" />
		</div>

		<!-- separator -->
		<div class="skel-separator" />

		<!-- detail lines -->
		<div class="skeleton-row">
			<div class="skel skel-line-long" />
		</div>
		<div class="skeleton-row mt-xs">
			<div class="skel skel-line-mid" />
		</div>
		<div class="skeleton-row mt-xs">
			<div class="skel skel-line-short" />
		</div>

		<!-- hero quick-access buttons -->
		<template v-if="hero">
			<div class="skel-btn-row mt-sm">
				<div class="skel skel-btn" />
				<div class="skel skel-btn" />
			</div>
		</template>
	</div>
</template>

<style scoped>
/* ── card shell ── */
.bean-card-skeleton {
	grid-column: 1 / 5;
	border-radius: var(--pico-border-radius);
	padding: 16px;
	overflow: hidden;

	background: oklch(from var(--neutral-800) l c h / 0.55);
	border: 1px solid oklch(from var(--neutral-700) l c h / 0.4);
	box-shadow:
		0 4px 6px oklch(from var(--terva-shadow, var(--neutral-900)) l c h / 0.4),
		0 1px 0 oklch(1 0 0 / 0.06) inset;
}

/* ── shimmer keyframe ── */
@keyframes shimmer {
	0%   { background-position: -200% center; }
	100% { background-position:  200% center; }
}

/* ── shared skeleton piece ── */
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

/* ── layout helpers ── */
.skeleton-row {
	display: flex;
	align-items: center;
}

.apart {
	justify-content: space-between;
}

.mt-xs { margin-top: 6px; }
.mt-sm { margin-top: 12px; }

/* ── individual piece sizes ── */
.skel-name    { width: 55%; height: 20px; }
.skel-badge   { width: 52px; height: 20px; border-radius: 999px; }
.skel-roast   { width: 25%; }
.skel-roaster { width: 22%; }

.skel-separator {
	height: 1px;
	background: oklch(from var(--neutral-600) l c h / 0.35);
	margin: 10px 0;
}

.skel-line-long  { width: 80%; }
.skel-line-mid   { width: 60%; }
.skel-line-short { width: 40%; }

/* ── hero quick-access buttons ── */
.skel-btn-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}

.skel-btn {
	height: 32px;
	border-radius: var(--pico-border-radius);
}
</style>

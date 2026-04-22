<template>
	<div class="brew-card-skeleton">
		<!-- recipe name -->
		<div class="skeleton-row">
			<div class="skel skel-title" />
		</div>

		<!-- brewer / grinder -->
		<div class="skeleton-row apart mt-xs">
			<div class="skel skel-gear" />
			<div class="skel skel-gear" />
		</div>

		<div class="skel-separator" />

		<!-- stats pills -->
		<div class="stats-row">
			<div class="stat-block" v-for="i in 4" :key="i">
				<div class="skel skel-stat-value" />
				<div class="skel skel-stat-label" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.brew-card-skeleton {
	grid-column: 1 / 5;
	border-radius: var(--pico-border-radius);
	padding: 12px;
	overflow: hidden;

	background: oklch(from var(--neutral-800) l c h / 0.55);
	border: 1px solid oklch(from var(--neutral-700) l c h / 0.4);
	box-shadow:
		0 4px 6px oklch(from var(--terva-shadow, var(--neutral-900)) l c h / 0.4),
		0 1px 0 oklch(1 0 0 / 0.06) inset;
}

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

.skeleton-row {
	display: flex;
	align-items: center;
}

.apart {
	justify-content: space-between;
}

.mt-xs { margin-top: 6px; }

.skel-title      { width: 45%; height: 22px; }
.skel-gear       { width: 28%; height: 12px; }

.skel-separator {
	height: 1px;
	background: oklch(from var(--neutral-600) l c h / 0.35);
	margin: 10px 0;
}

.stats-row {
	display: flex;
	flex-direction: row;
	gap: 16px;
	flex-wrap: wrap;
	margin-top: 4px;
}

.stat-block {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.skel-stat-value { width: 36px; height: 14px; }
.skel-stat-label { width: 28px; height: 10px; }
</style>

<!--
ProfileSkeleton
Full-page skeleton for the UserProfile screen.
Mirrors: hero-card, closeness-card, stats-grid (2 tiles),
         fun-stat card, and account-card.

CREATED ON: 17APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
// no props — this mirrors the full profile layout
</script>

<template>
	<!-- Hero card -->
	<div class="hero-card-skeleton hero-card">
		<div class="avatar-row">
			<div class="skel skel-avatar" />
			<div class="name-block">
				<div class="skel skel-name" />
				<div class="skel skel-since" />
			</div>
		</div>
		<hr />
		<div class="skel skel-brew-count" />
	</div>

	<!-- Section label -->
	<div class="skel skel-section-label" />

	<!-- Closeness card -->
	<article class="closeness-card terva-card">
		<div v-for="i in 3" :key="i" class="closeness-row">
			<div class="skel skel-cl-label" />
			<div class="skel skel-cl-bar" />
			<div class="skel skel-cl-count" />
		</div>
	</article>

	<!-- Section label -->
	<div class="skel skel-section-label" />

	<!-- Stats grid (2 tiles) -->
	<div class="stats-grid">
		<article class="terva-card stats-tile-skel" v-for="i in 2" :key="i">
			<div class="skel skel-tile-label" />
			<div class="skel skel-tile-value" />
			<div class="skel skel-tile-sub" />
		</article>
	</div>

	<!-- Fun stat card -->
	<article class="terva-card fun-stat-skel">
		<div class="skel skel-fun-line-a" />
		<div class="skel skel-fun-line-b" />
	</article>

	<!-- Section label -->
	<div class="skel skel-section-label" />

	<!-- Account card -->
	<article class="account-card terva-card">
		<div v-for="i in 4" :key="i" class="account-row-skel">
			<div class="skel skel-account-line" :style="{ width: (55 - i * 4) + '%' }" />
			<hr v-if="i < 4" />
		</div>
	</article>
</template>

<style scoped>
/*  shimmer  */
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

/*  hero card  */
/* reuses the exact .hero-card class from UserProfile so it's pixel-matched */
.hero-card-skeleton {
	grid-column: span 4;
}

.avatar-row {
	display: flex;
	align-items: center;
	gap: 14px;
}

.skel-avatar {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	flex-shrink: 0;
}

.name-block {
	display: flex;
	flex-direction: column;
	gap: 6px;
	flex: 1;
}

.skel-name  { width: 50%; height: 18px; }
.skel-since { width: 35%; height: 12px; }

.skel-brew-count {
	width: 30%;
	height: 22px;
	margin-top: 2px;
}

/*  section label  */
.skel-section-label {
	grid-column: span 4;
	width: 80px;
	height: 11px;
	border-radius: 4px;
	margin-left: 2px;
	background: linear-gradient(
		90deg,
		oklch(from var(--neutral-700) l c h / 0.5) 25%,
		oklch(from var(--neutral-600) l c h / 0.6) 50%,
		oklch(from var(--neutral-700) l c h / 0.5) 75%
	);
	background-size: 200% 100%;
	animation: shimmer 1.6s ease-in-out infinite;
}

/*  closeness card  */
/* reuses .closeness-card and .terva-card from UserProfile */
.closeness-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 4px 0;
}

.closeness-row + .closeness-row {
	margin-top: 6px;
}

.skel-cl-label { width: 48px; flex-shrink: 0; }
.skel-cl-bar   { flex: 1; height: 10px; border-radius: 999px; }
.skel-cl-count { width: 20px; flex-shrink: 0; }

/*  stats grid  */
/* mirrors .stats-grid from UserProfile */
.stats-grid {
	grid-column: span 4;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.stats-tile-skel {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 14px 16px;
}

.skel-tile-label { width: 55%; height: 11px; }
.skel-tile-value { width: 75%; height: 18px; }
.skel-tile-sub   { width: 45%; height: 11px; }

/*  fun stat card  */
.fun-stat-skel {
	grid-column: span 4;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.skel-fun-line-a { width: 80%; }
.skel-fun-line-b { width: 55%; }

/*  account card  */
.account-row-skel {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.account-row-skel hr {
	margin: 10px 0;
	border-color: oklch(from var(--terva-app-bar-border) l c h / 0.12);
}

.skel-account-line {
	height: 15px;
}
</style>

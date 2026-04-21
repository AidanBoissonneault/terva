<script setup lang="ts">
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
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
		<div class="brew-count-row">
			<div class="skel skel-brew-num" />
			<div class="skel skel-brew-label" />
		</div>
	</div>

	<SectionSeperator />

	<!-- Section label: How it's going -->
	<div class="skel skel-section-label" />

	<!-- Closeness card -->
	<article class="closeness-card terva-card">
		<div v-for="i in 3" :key="i" class="closeness-row">
			<div class="skel skel-cl-label" />
			<div class="skel skel-cl-bar" />
			<div class="skel skel-cl-count" />
		</div>
	</article>

	<!-- Section label: Favourites -->
	<div class="skel skel-section-label" />

	<!-- Stats grid (4 tiles max) -->
	<div class="stats-grid">
		<article class="terva-card stats-tile-skel" v-for="i in 4" :key="i">
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

	<SectionSeperator />

	<!-- Section label: Account -->
	<div class="skel skel-section-label" />

	<!-- Account card: Name, Email, Change password, Sign out, Delete -->
	<article class="account-card terva-card">
		<div class="account-row-skel account-row-labeled">
			<div class="skel skel-row-sub" style="width: 28%" />
			<div class="skel skel-row-val" style="width: 52%" />
		</div>
		<hr />
		<div class="account-row-skel account-row-labeled">
			<div class="skel skel-row-sub" style="width: 22%" />
			<div class="skel skel-row-val" style="width: 64%" />
		</div>
		<hr />
		<div class="account-row-skel">
			<div class="skel skel-row-link" style="width: 48%" />
		</div>
		<hr />
		<div class="account-row-skel">
			<div class="skel skel-row-link" style="width: 30%" />
		</div>
		<hr class="danger-hr" />
		<div class="account-row-skel">
			<div class="skel skel-row-link" style="width: 36%" />
		</div>
	</article>

	<!-- Section label: Policies -->
	<div class="skel skel-section-label" />

	<!-- Policies card -->
	<article class="account-card terva-card">
		<div class="account-row-skel">
			<div class="skel skel-row-link" style="width: 52%" />
		</div>
		<hr />
		<div class="account-row-skel">
			<div class="skel skel-row-link" style="width: 38%" />
		</div>
		<hr />
		<div class="account-row-skel">
			<div class="skel skel-row-link" style="width: 42%" />
		</div>
	</article>

	<!-- Section label: Feedback -->
	<div class="skel skel-section-label" />

	<!-- Feedback card -->
	<article class="account-card terva-card">
		<div class="account-row-skel">
			<div class="skel skel-row-link" style="width: 34%" />
		</div>
	</article>
</template>

<style scoped>
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

/* hero card */
.hero-card-skeleton {
	grid-column: span 4;
}

.avatar-row {
	display: flex;
	align-items: center;
	gap: 14px;
}

.skel-avatar {
	width: 52px;
	height: 52px;
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

.brew-count-row {
	display: flex;
	align-items: flex-end;
	gap: 6px;
	margin-top: 2px;
}

.skel-brew-num   { width: 44px; height: 28px; }
.skel-brew-label { width: 72px; height: 11px; margin-bottom: 2px; }

/* section label */
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

/* closeness card */
.closeness-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 4px 0;
}

.closeness-row + .closeness-row {
	margin-top: 6px;
}

.skel-cl-label { width: 52px; height: 14px; flex-shrink: 0; }
.skel-cl-bar   { flex: 1; height: 7px; border-radius: 999px; }
.skel-cl-count { width: 24px; flex-shrink: 0; }

/* stats grid */
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
}

.skel-tile-label { width: 55%; height: 11px; }
.skel-tile-value { width: 75%; height: 18px; }
.skel-tile-sub   { width: 45%; height: 11px; }

/* fun stat card */
.fun-stat-skel {
	grid-column: span 4;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.skel-fun-line-a { width: 80%; }
.skel-fun-line-b { width: 55%; }

/* account cards */
.account-row-skel {
	padding: 4px 0;
}

.account-row-labeled {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.account-row-skel hr {
	margin: 4px 0;
	border-color: oklch(from var(--terva-app-bar-border) l c h / 0.12);
}

.skel-row-sub  { height: 11px; }
.skel-row-val  { height: 14px; }
.skel-row-link { height: 14px; }

.danger-hr {
	border-color: oklch(from var(--red-900) l c h / 0.3);
	margin: 8px 0 4px !important;
}
</style>

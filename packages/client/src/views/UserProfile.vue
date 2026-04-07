<script setup lang="ts">
import { ref } from 'vue'

// ── Dummy data ────────────────────────────────────────────────────────────────
const user = ref({
	name: 'Aidan Boissonneault',
	email: 'aidan@example.com',
	memberSince: 'March 2026',
	initials: 'AB',
})

const stats = ref({
	totalBrews: 47,
	success: 32,
	close: 11,
	miss: 4,
	totalDoseG: 705,
	favouriteMethod: 'Pour-over',
	favouriteMethodCount: 28,
	favouriteBean: 'Yirgacheffe Natural',
	favouriteBeanRoaster: 'Boon Boona',
	favouriteGrinder: 'Comandante C40',
	favouriteGrinderCount: 41,
	favouriteBrewer: 'Orea V3',
	favouriteBrewerCount: 28,
})

// ── Delete account confirmation ───────────────────────────────────────────────
const showDeleteConfirm = ref(false)

function handleDeleteAccount() {
	// TODO: wire to BetterAuth delete endpoint
	console.log('Delete account confirmed')
	showDeleteConfirm.value = false
}
</script>

<template>
	<div class="profile-screen dashboard">

		<!-- ── Hero card ────────────────────────────────────────────────────── -->
		<div class="hero-card">
			<div class="avatar-row">
				<div class="avatar">{{ user.initials }}</div>
				<div class="avatar-text">
					<span class="user-name">{{ user.name }}</span>
					<small class="member-since">Member since {{ user.memberSince }}</small>
				</div>
			</div>
			<div class="hero-divider" />
			<div class="brew-count-row">
				<span class="brew-count-num">{{ stats.totalBrews }}</span>
				<small class="brew-count-label">brews logged</small>
			</div>
		</div>

		<!-- ── Section label ────────────────────────────────────────────────── -->
		<p class="section-label">How it's going</p>

		<!-- ── Closeness bars ───────────────────────────────────────────────── -->
		<div class="closeness-card">
			<div class="closeness-row">
				<small class="cl-label">Success</small>
				<div class="cl-bar-bg">
					<div class="cl-bar-fill success" :style="{ width: (stats.success / stats.totalBrews * 100) + '%' }" />
				</div>
				<small class="cl-count">{{ stats.success }}</small>
			</div>
			<div class="closeness-row">
				<small class="cl-label">Close</small>
				<div class="cl-bar-bg">
					<div class="cl-bar-fill close" :style="{ width: (stats.close / stats.totalBrews * 100) + '%' }" />
				</div>
				<small class="cl-count">{{ stats.close }}</small>
			</div>
			<div class="closeness-row">
				<small class="cl-label">Miss</small>
				<div class="cl-bar-bg">
					<div class="cl-bar-fill miss" :style="{ width: (stats.miss / stats.totalBrews * 100) + '%' }" />
				</div>
				<small class="cl-count">{{ stats.miss }}</small>
			</div>
		</div>

		<!-- ── Section label ────────────────────────────────────────────────── -->
		<p class="section-label">Favourites</p>

		<!-- ── Stats grid ───────────────────────────────────────────────────── -->
		<div class="stats-grid">
			<div class="stat-card">
				<small class="stat-label">Brew method</small>
				<span class="stat-value">{{ stats.favouriteMethod }}</span>
				<small class="stat-sub">{{ stats.favouriteMethodCount }} times</small>
			</div>
			<div class="stat-card">
				<small class="stat-label">Bean</small>
				<span class="stat-value">{{ stats.favouriteBean }}</span>
				<small class="stat-sub">{{ stats.favouriteBeanRoaster }}</small>
			</div>
			<div class="stat-card">
				<small class="stat-label">Grinder</small>
				<span class="stat-value">{{ stats.favouriteGrinder }}</span>
				<small class="stat-sub">{{ stats.favouriteGrinderCount }} uses</small>
			</div>
			<div class="stat-card">
				<small class="stat-label">Brewer</small>
				<span class="stat-value">{{ stats.favouriteBrewer }}</span>
				<small class="stat-sub">{{ stats.favouriteBrewerCount }} uses</small>
			</div>
		</div>

		<!-- ── Fun stat ─────────────────────────────────────────────────────── -->
		<div class="fun-stat-card">
			<div class="fun-stat-icon">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<ellipse cx="10" cy="14" rx="6" ry="3" fill="var(--brand-600)" opacity="0.4"/>
					<path d="M7 13 Q7 6 10 4 Q13 6 13 13" fill="var(--brand-700)"/>
					<path d="M8.5 13 Q8.5 8 10 6.5 Q11.5 8 11.5 13" fill="var(--brand-400)"/>
				</svg>
			</div>
			<div>
				<span class="fun-stat-value">{{ stats.totalDoseG }}g of coffee ground</span>
				<small class="fun-stat-label">across all your brews</small>
			</div>
		</div>

		<!-- ── Section label ────────────────────────────────────────────────── -->
		<p class="section-label">Account</p>

		<!-- ── Account settings ─────────────────────────────────────────────── -->
		<div class="settings-card">
			<div class="settings-row">
				<div class="settings-row-content">
					<small class="settings-row-label">Name</small>
					<span class="settings-row-value">{{ user.name }}</span>
				</div>
				<span class="settings-arrow">›</span>
			</div>
			<div class="settings-divider" />
			<div class="settings-row">
				<div class="settings-row-content">
					<small class="settings-row-label">Email</small>
					<span class="settings-row-value">{{ user.email }}</span>
				</div>
				<span class="settings-arrow">›</span>
			</div>
			<div class="settings-divider" />
			<div class="settings-row">
				<div class="settings-row-content">
					<span class="settings-row-value">Change password</span>
				</div>
				<span class="settings-arrow">›</span>
			</div>
			<div class="settings-divider" />
			<div class="settings-row">
				<span class="settings-row-value danger">Sign out</span>
			</div>

			<!-- thin gap before the destructive zone -->
			<div class="settings-divider danger-divider" />

			<div class="settings-row" @click="showDeleteConfirm = true">
				<span class="settings-row-value danger muted">Delete account</span>
			</div>
		</div>

		<!-- ── Delete confirmation overlay ──────────────────────────────────── -->
		<Transition name="fade">
			<div v-if="showDeleteConfirm" class="confirm-backdrop" @click.self="showDeleteConfirm = false">
				<div class="confirm-sheet">
					<h2>Delete account?</h2>
					<p>This permanently removes your account and all brew data. This cannot be undone.</p>
					<div class="confirm-actions">
						<button class="glass" @click="showDeleteConfirm = false">Cancel</button>
						<button class="glass danger-btn" @click="handleDeleteAccount">Delete</button>
					</div>
				</div>
			</div>
		</Transition>

	</div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────────── */
.profile-screen {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-bottom: 48px;
}

/* ── Hero card ───────────────────────────────────────────────────────────────── */
.hero-card {
	grid-column: 1 / 5;
	border-radius: 12px;
	padding: 20px;
	position: relative;
	isolation: isolate;
	overflow: hidden;
	color: #fff;

	background:
		linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.05)) border-box,
		radial-gradient(ellipse 80% 100% at 15% 40%, var(--brand-700) 0%, var(--brand-700) 30%, transparent 80%) padding-box,
		radial-gradient(ellipse 75% 110% at 50% 55%, var(--brand-800) 0%, var(--brand-800) 30%, transparent 80%) padding-box,
		radial-gradient(ellipse 85% 100% at 80% 30%, var(--brand-900) 0%, var(--brand-900) 30%, transparent 80%) padding-box;

	background-color: var(--brand-900);

	border: 2px inset oklch(from var(--brand-700) l c h / 0.2);
	box-shadow:
		0 0 0 1px oklch(from var(--brand-700) l c h / 0.15),
		0 4px 6px oklch(from var(--husk-shadow) l c h / 0.6),
		0 6px 12px oklch(from var(--brand-700) l c h / 0.28),
		0 12px 24px oklch(from var(--brand-900) l c h / 0.22);
}

.hero-card::before {
	content: '';
	position: absolute;
	inset: -10%;
	background: inherit;
	filter: blur(30px);
	opacity: 0.6;
	z-index: -1;
	background-clip: padding-box;
}

.avatar-row {
	display: flex;
	align-items: center;
	gap: 14px;
}

.avatar {
	width: 52px;
	height: 52px;
	border-radius: 50%;
	background: oklch(from var(--brand-600) l c h / 0.6);
	border: 2px solid oklch(from var(--brand-400) l c h / 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: 500;
	color: #fff;
	flex-shrink: 0;
}

.avatar-text {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.user-name {
	font-size: 18px;
	font-weight: 500;
	color: #fff;
	line-height: 1.2;
}

.member-since {
	color: oklch(from var(--brand-200) l c h / 0.8);
}

.hero-divider {
	width: 100%;
	height: 1px;
	background: oklch(from var(--husk-highlight) l c h / 0.15);
	margin: 14px 0;
}

.brew-count-row {
	display: flex;
	align-items: baseline;
	gap: 6px;
}

.brew-count-num {
	font-size: 32px;
	font-weight: 500;
	color: #fff;
	line-height: 1;
}

.brew-count-label {
	color: oklch(from var(--brand-200) l c h / 0.8);
}

/* ── Section label ───────────────────────────────────────────────────────────── */
.section-label {
	grid-column: 1 / 5;
	font-size: 0.7rem;
	font-weight: 500;
	letter-spacing: 0.07em;
	text-transform: uppercase;
	color: var(--neutral-500);
	margin: 4px 2px 0;
}

/* ── Closeness card ──────────────────────────────────────────────────────────── */
.closeness-card {
	grid-column: 1 / 5;
	background: var(--pico-background-color);
	border: 1px solid oklch(from var(--husk-highlight) l c h / 0.1);
	border-radius: 12px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	box-shadow: 0 2px 4px oklch(from var(--husk-shadow) l c h / 0.4);
}

.closeness-row {
	display: flex;
	align-items: center;
	gap: 10px;
}

.cl-label {
	width: 52px;
	flex-shrink: 0;
	color: var(--pico-color);
	opacity: 0.7;
}

.cl-bar-bg {
	flex: 1;
	height: 7px;
	border-radius: 99px;
	background: oklch(from var(--husk-shadow) l c h / 0.15);
	overflow: hidden;
}

.cl-bar-fill {
	height: 100%;
	border-radius: 99px;
	transition: width 0.4s ease;
}

.cl-bar-fill.success { background: var(--green-500); }
.cl-bar-fill.close   { background: var(--orange-500); }
.cl-bar-fill.miss    { background: var(--red-500); }

.cl-count {
	width: 24px;
	text-align: right;
	flex-shrink: 0;
	font-weight: 500;
	color: var(--pico-color);
}

/* ── Stats grid ──────────────────────────────────────────────────────────────── */
.stats-grid {
	grid-column: 1 / 5;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px;
}

.stat-card {
	background: var(--pico-background-color);
	border: 1px solid oklch(from var(--husk-highlight) l c h / 0.1);
	border-radius: 12px;
	padding: 14px;
	display: flex;
	flex-direction: column;
	gap: 2px;
	box-shadow: 0 2px 4px oklch(from var(--husk-shadow) l c h / 0.4);
}

.stat-label {
	color: var(--neutral-500);
	font-size: 0.7rem;
}

.stat-value {
	font-size: 0.95rem;
	font-weight: 500;
	color: var(--pico-color);
	line-height: 1.3;
}

.stat-sub {
	color: var(--neutral-500);
	font-size: 0.7rem;
}

/* ── Fun stat ────────────────────────────────────────────────────────────────── */
.fun-stat-card {
	grid-column: 1 / 5;
	background: var(--pico-background-color);
	border: 1px solid oklch(from var(--husk-highlight) l c h / 0.1);
	border-radius: 12px;
	padding: 14px 16px;
	display: flex;
	align-items: center;
	gap: 14px;
	box-shadow: 0 2px 4px oklch(from var(--husk-shadow) l c h / 0.4);
}

.fun-stat-icon {
	width: 40px;
	height: 40px;
	border-radius: 10px;
	background: oklch(from var(--brand-300) l c h / 0.25);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.fun-stat-value {
	font-size: 0.95rem;
	font-weight: 500;
	color: var(--pico-color);
	display: block;
}

.fun-stat-label {
	color: var(--neutral-500);
	font-size: 0.75rem;
}

/* ── Settings card ───────────────────────────────────────────────────────────── */
.settings-card {
	grid-column: 1 / 5;
	background: var(--pico-background-color);
	border: 1px solid oklch(from var(--husk-highlight) l c h / 0.1);
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 4px oklch(from var(--husk-shadow) l c h / 0.4);
}

.settings-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 14px 16px;
	cursor: pointer;
	transition: background 0.15s ease;
}

.settings-row:hover {
	background: oklch(from var(--husk-highlight) l c h / 0.05);
}

.settings-row-content {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.settings-row-label {
	color: var(--neutral-500);
	font-size: 0.7rem;
}

.settings-row-value {
	font-size: 0.9rem;
	color: var(--pico-color);
}

.settings-row-value.danger {
	color: var(--red-500);
}

.settings-row-value.danger.muted {
	color: var(--red-700);
}

.settings-arrow {
	color: var(--neutral-500);
	font-size: 1.1rem;
}

.settings-divider {
	height: 1px;
	background: oklch(from var(--husk-highlight) l c h / 0.1);
	margin: 0 16px;
}

.danger-divider {
	margin: 4px 16px;
	background: oklch(from var(--red-900) l c h / 0.15);
}

/* ── Delete confirmation ─────────────────────────────────────────────────────── */
.confirm-backdrop {
	position: fixed;
	inset: 0;
	background: oklch(from var(--neutral-900) l c h / 0.6);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	z-index: 9999;
	padding-bottom: 24px;
	-webkit-backdrop-filter: blur(4px);
	backdrop-filter: blur(4px);
}

.confirm-sheet {
	background: var(--pico-background-color);
	border-radius: 16px;
	padding: 24px;
	width: calc(100% - 48px);
	max-width: 420px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	box-shadow: 0 -4px 24px oklch(from var(--husk-shadow) l c h / 0.4);
}

.confirm-sheet h2 {
	font-size: 1.1rem;
	font-weight: 500;
	color: var(--red-500);
	margin: 0;
}

.confirm-sheet p {
	font-size: 0.875rem;
	color: var(--pico-color);
	opacity: 0.75;
	margin: 0;
	line-height: 1.5;
}

.confirm-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 4px;
}

.danger-btn {
	border-color: oklch(from var(--red-500) l c h / 0.5) !important;
	color: var(--red-400) !important;
}

.danger-btn:hover {
	background-color: oklch(from var(--red-900) l c h / 0.3) !important;
}

/* ── Transition ──────────────────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

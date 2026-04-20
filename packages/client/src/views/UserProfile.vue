<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { getProfile, deleteAccount } from '@/api/getProfile'
import { useLoadingStore } from '@/stores/loading'
import { invalidateSessionCache } from '@/router'
import SectionSeperator from '@/components/Utils/SectionSeperator.vue'
import FullscreenOverlay from '@/components/Utils/Overlay/FullscreenOverlay.vue'
import ProfileSkeleton from '@/components/Skeleton/ProfileSkeleton.vue'
import type { UserProfile } from '@terva/shared'

const loading = useLoadingStore()

const router = useRouter()

const profile = ref<UserProfile | null>(null)
const error = ref<string | null>(null)
const showDeleteConfirm = ref(false)
const deletePassword = ref('')
const deleteError = ref('')
const deleteLoading = ref(false)

const initials = computed(() => {
	if (!profile.value?.name) return '?'
	return profile.value.name
		.split(' ')
		.map((w) => w[0])
		.join('')
		.slice(0, 2)
		.toUpperCase()
})

const memberSince = computed(() => {
	if (!profile.value?.memberSince) return ''
	return new Date(profile.value.memberSince).toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
	})
})

const totalBrews = computed(
	() =>
		(profile.value?.closeness.success ?? 0) +
		(profile.value?.closeness.close ?? 0) +
		(profile.value?.closeness.miss ?? 0),
)

const successWidth = computed(() =>
	totalBrews.value
		? Math.round(((profile.value?.closeness.success ?? 0) / totalBrews.value) * 100) + '%'
		: '0%',
)
const closeWidth = computed(() =>
	totalBrews.value
		? Math.round(((profile.value?.closeness.close ?? 0) / totalBrews.value) * 100) + '%'
		: '0%',
)
const missWidth = computed(() =>
	totalBrews.value
		? Math.round(((profile.value?.closeness.miss ?? 0) / totalBrews.value) * 100) + '%'
		: '0%',
)

onMounted(async () => {
	loading.start()
	try {
		const res = await getProfile()
		if (!res.success) throw new Error(res.error)
		profile.value = res.payload
	} catch (err) {
		if (err instanceof Error) error.value = err.message
		else error.value = 'An unknown error occurred'
	} finally {
		loading.stop()
	}
})

async function handleSignOut() {
	invalidateSessionCache()
	await authClient.signOut()
	router.push({ name: 'login' })
}

function openDeleteConfirm() {
	deletePassword.value = ''
	deleteError.value = ''
	showDeleteConfirm.value = true
}

function cancelDelete() {
	showDeleteConfirm.value = false
	deletePassword.value = ''
	deleteError.value = ''
}

async function handleDeleteAccount() {
	deleteError.value = ''
	deleteLoading.value = true

	const { error: authError } = await authClient.signIn.email({
		email: profile.value!.email,
		password: deletePassword.value,
	})

	if (authError) {
		deleteError.value = 'Incorrect password.'
		deleteLoading.value = false
		return
	}

	const res = await deleteAccount()
	deleteLoading.value = false

	if (res.success) {
		invalidateSessionCache()
		await authClient.signOut()
		router.push({ name: 'login' })
	}

	showDeleteConfirm.value = false
}

function openBugReport() {
	window.open(
		'https://docs.google.com/forms/d/e/1FAIpQLSd0uz4nGo7I1Sqkdk3qoS6d6NMo1UJcHALxOaReXSMTEm99Ow/viewform?usp=dialog',
		'_blank',
		'noopener,noreferrer',
	)
}
</script>

<template>
<template v-if="loading.isRouteLoading">
	<div class="dashboard">
		<ProfileSkeleton />
	</div>
</template>
<template v-else>
	<div class="dashboard">
		<div v-if="error">{{ error }}</div>

		<template v-else-if="profile">
			<div class="hero-card">
				<div class="avatar-row">
					<div class="avatar">{{ initials }}</div>
					<div>
						<p class="user-name">{{ profile.name }}</p>
						<small>Member since {{ memberSince }}</small>
					</div>
				</div>
				<hr />
				<div class="brew-count-row">
					<span class="brew-count-num">{{ totalBrews }}</span>
					<small>brews logged</small>
				</div>
			</div>

			<SectionSeperator />

			<small class="section-label">How it's going</small>

			<article class="closeness-card terva-card">
				<div class="closeness-row">
					<small class="cl-label">Success</small>
					<div class="cl-bar-bg">
						<div class="cl-bar-fill success" :style="{ width: successWidth }" />
					</div>
					<small class="cl-count">{{ profile.closeness.success }}</small>
				</div>
				<div class="closeness-row">
					<small class="cl-label">Close</small>
					<div class="cl-bar-bg">
						<div class="cl-bar-fill close" :style="{ width: closeWidth }" />
					</div>
					<small class="cl-count">{{ profile.closeness.close }}</small>
				</div>
				<div class="closeness-row">
					<small class="cl-label">Miss</small>
					<div class="cl-bar-bg">
						<div class="cl-bar-fill miss" :style="{ width: missWidth }" />
					</div>
					<small class="cl-count">{{ profile.closeness.miss }}</small>
				</div>
			</article>

			<small class="section-label">Favourites</small>

			<div class="stats-grid">
				<article v-if="profile.favouriteMethod" class="terva-card">
					<small>Brew method</small>
					<p>{{ profile.favouriteMethod }}</p>
					<small>{{ profile.favouriteMethodCount }} times</small>
				</article>
				<article v-if="profile.favouriteBean" class="terva-card">
					<small>Bean</small>
					<p>{{ profile.favouriteBean }}</p>
					<small>{{ profile.favouriteBeanRoaster }}</small>
				</article>
				<article v-if="profile.favouriteGrinder" class="terva-card">
					<small>Grinder</small>
					<p>{{ profile.favouriteGrinder }}</p>
					<small>{{ profile.favouriteGrinderCount }} uses</small>
				</article>
				<article v-if="profile.favouriteBrewer" class="terva-card">
					<small>Brewer</small>
					<p>{{ profile.favouriteBrewer }}</p>
					<small>{{ profile.favouriteBrewerCount }} uses</small>
				</article>
			</div>

			<article v-if="profile.totalDoseG > 0" class="fun-stat terva-card">
				<p>
					<strong>{{ profile.totalDoseG }}g</strong> of coffee ground across all your brews
				</p>
			</article>

			<SectionSeperator />

			<small class="section-label">Account</small>

			<article class="account-card terva-card">
				<div class="account-row">
					<small>Name</small>
					<p>{{ profile.name }}</p>
				</div>
				<hr />
				<div class="account-row">
					<small>Email</small>
					<p>{{ profile.email }}</p>
				</div>
				<hr />
				<div class="account-row">
					<RouterLink :to="{ name: 'changepassword' }">Change password</RouterLink>
				</div>
				<hr />
				<div class="account-row">
					<a @click.prevent="handleSignOut" class="danger">Sign out</a>
				</div>
				<hr class="danger-hr" />
				<div class="account-row">
					<a @click.prevent="openDeleteConfirm" class="danger muted">Delete account</a>
				</div>
			</article>

			<small class="section-label">Policies</small>

			<article class="account-card terva-card">
				<RouterLink to="terms">Terms and Conditions</RouterLink>
				<hr />
				<RouterLink to="privacy">Privacy Policy</RouterLink>
				<hr />
				<RouterLink to="cookies">Cookies Policy</RouterLink>
			</article>

			<small class="section-label">Feedback</small>
			<article class="account-card terva-card">
				<a @click.prevent="openBugReport">Report a bug</a>
			</article>
		</template>

		<FullscreenOverlay :is-visible="showDeleteConfirm" @outside-clicked="cancelDelete">
			<div class="confirm-content">
				<p><strong>Delete account?</strong></p>
				<small
					>This permanently removes your account and all brew data. This cannot be undone.</small
				>

				<p v-if="deleteError" class="error-msg">{{ deleteError }}</p>

				<label for="delete-password">
					confirm your password
					<input
						id="delete-password"
						v-model="deletePassword"
						type="password"
						placeholder="••••••••"
						autocomplete="current-password"
					/>
				</label>

				<div class="confirm-actions">
					<button
						class="glass danger"
						:aria-busy="deleteLoading"
						:disabled="deleteLoading || !deletePassword"
						@click="handleDeleteAccount"
					>
						{{ deleteLoading ? '' : 'Delete' }}
					</button>
					<button class="glass" @click="cancelDelete">Cancel</button>
				</div>
			</div>
		</FullscreenOverlay>
	</div>
</template>
</template>

<style scoped>
article {
	padding: 12px;
}
.dashboard {
	display: grid;
	gap: 16px;
	grid-template-columns: repeat(4, 1fr);
	margin-left: 24px;
	margin-right: 24px;
	overflow: visible;
}

.hero-card {
	/* to avoid ios clipping */
	transform: translateZ(0);
	will-change: transform;

	grid-column: 1 / 5;
	border-radius: var(--pico-border-radius);
	padding: 20px;
	position: relative;
	isolation: isolate;
	overflow: hidden;
	color: #fff;

	background:
		linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)) border-box,
		radial-gradient(
				ellipse 80% 100% at 15% 40%,
				var(--brand-700) 0%,
				var(--brand-700) 30%,
				transparent 80%
			)
			padding-box,
		radial-gradient(
				ellipse 75% 110% at 50% 55%,
				var(--brand-800) 0%,
				var(--brand-800) 30%,
				transparent 80%
			)
			padding-box,
		radial-gradient(
				ellipse 85% 100% at 80% 30%,
				var(--brand-900) 0%,
				var(--brand-900) 30%,
				transparent 80%
			)
			padding-box;
	background-color: var(--brand-900);

	border: 2px inset oklch(from var(--brand-700) l c h / 0.2);
	box-shadow:
		0 4px 6px oklch(from var(--terva-shadow) l c h / 0.6),
		0 6px 12px oklch(from var(--brand-700) l c h / 0.28),
		0 12px 24px oklch(from var(--brand-900) l c h / 0.22);

	& hr {
		border-color: oklch(from var(--terva-highlight) l c h / 0.15);
		margin: 14px 0;
	}
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

.user-name {
	font-size: 1.1rem;
	font-weight: 500;
	color: #fff;
	margin: 0;
}

.brew-count-row {
	display: flex;
	align-items: baseline;
	gap: 6px;

	& small {
		color: oklch(from var(--brand-200) l c h / 0.8);
	}
}

.brew-count-num {
	font-size: 2rem;
	font-weight: 500;
	color: #fff;
	line-height: 1;
}

.section-label {
	grid-column: 1 / 5;
	font-size: 0.7rem;
	font-weight: 500;
	letter-spacing: 0.07em;
	text-transform: uppercase;
	color: var(--neutral-500);
	margin-bottom: -8px;
}

.closeness-card {
	grid-column: 1 / 5;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.closeness-row {
	display: flex;
	align-items: center;
	gap: 10px;
}

.cl-label {
	width: 52px;
	flex-shrink: 0;
}

.cl-bar-bg {
	flex: 1;
	height: 7px;
	border-radius: 99px;
	background: oklch(from var(--terva-shadow) l c h / 0.15);
	overflow: hidden;
}

.cl-bar-fill {
	height: 100%;
	border-radius: 99px;
	transition: width 0.4s ease;
}

.cl-bar-fill.success {
	background: var(--green-500);
}

.cl-bar-fill.close {
	background: var(--orange-500);
}

.cl-bar-fill.miss {
	background: var(--red-500);
}

.cl-count {
	width: 24px;
	text-align: right;
	flex-shrink: 0;
	font-weight: 500;
}

.stats-grid {
	grid-column: 1 / 5;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px;

	& article {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin: 0;

		& p {
			font-size: 0.95rem;
			font-weight: 500;
			margin: 0;
			line-height: 1.3;
		}
	}
}

.fun-stat {
	grid-column: 1 / 5;
	margin: 0;

	& p {
		font-size: 0.9rem;
	}
}

.account-card {
	grid-column: 1 / 5;

	& hr {
		margin: 4px 0;
	}
}

.account-row {
	padding: 4px 0;

	& p {
		margin: 0;
		font-size: 0.9rem;
	}
}

.danger-hr {
	border-color: oklch(from var(--red-900) l c h / 0.3);
	margin: 8px 0 4px !important;
}

a.danger {
	color: var(--red-500);
}

a.danger.muted {
	color: var(--red-700);
}

.confirm-content {
	display: flex;
	flex-direction: column;
	gap: 8px;

	& strong {
		color: var(--pico-primary-inverse);
	}

	& label {
		color: var(--pico-primary-inverse);
		font-size: 0.875rem;
	}
}

.confirm-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	margin-top: 8px;
}

.error-msg {
	color: var(--pico-del-color);
	background: color-mix(in srgb, var(--pico-del-color) 10%, transparent);
	border: 1px solid color-mix(in srgb, var(--pico-del-color) 30%, transparent);
	padding: 0.5rem 0.75rem;
	border-radius: var(--pico-border-radius);
	font-size: 0.875rem;
	margin: 0;
}

.stats-grid article {
	grid-column: auto;
}
</style>

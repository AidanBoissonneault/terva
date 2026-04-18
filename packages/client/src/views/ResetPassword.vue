<!--
Reset Password View
Landed on from the email link — reads the token from the URL query string
and calls better-auth's resetPassword endpoint.

CREATED ON: 17APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authClient } from '@/lib/auth-client'

const router = useRouter()
const route = useRoute()

const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)
const tokenMissing = ref(false)

onMounted(() => {
	const t = route.query.token
	if (!t || typeof t !== 'string') {
		tokenMissing.value = true
	} else {
		token.value = t
	}
})

async function handleReset() {
	error.value = ''

	if (newPassword.value !== confirmPassword.value) {
		error.value = 'Passwords do not match.'
		return
	}

	if (newPassword.value.length < 8) {
		error.value = 'Password must be at least 8 characters.'
		return
	}

	loading.value = true

	const { error: authError } = await authClient.resetPassword({
		newPassword: newPassword.value,
		token: token.value,
	})

	loading.value = false

	if (authError) {
		error.value = authError.message ?? 'Reset failed. The link may have expired.'
	} else {
		success.value = true
		setTimeout(() => router.push('/login'), 2000)
	}
}
</script>

<template>
	<div class="dashboard">
		<article>
			<!-- Invalid / missing token -->
			<template v-if="tokenMissing">
				<hgroup>
					<h1>Invalid link</h1>
					<p>this reset link is missing or malformed</p>
				</hgroup>
				<p class="error-msg">Please request a new password reset link.</p>
				<footer>
					<RouterLink to="/forgot-password">request new link</RouterLink>
				</footer>
			</template>

			<!-- Success state -->
			<template v-else-if="success">
				<hgroup>
					<h1>Password updated</h1>
					<p>redirecting you to sign in</p>
				</hgroup>
				<p class="success-msg">Your password has been reset. Redirecting...</p>
			</template>

			<!-- Reset form -->
			<template v-else>
				<hgroup>
					<h1>Reset password</h1>
					<p>choose a new password</p>
				</hgroup>

				<p v-if="error" class="error-msg">{{ error }}</p>

				<label for="new-password">
					new password
					<input
						id="new-password"
						v-model="newPassword"
						type="password"
						placeholder="min. 8 characters"
						autocomplete="new-password"
						required
					/>
				</label>

				<label for="confirm-password">
					confirm new password
					<input
						id="confirm-password"
						v-model="confirmPassword"
						type="password"
						placeholder="••••••••"
						autocomplete="new-password"
						required
					/>
				</label>

				<button
					:aria-busy="loading"
					:disabled="loading || !newPassword || !confirmPassword"
					@click="handleReset"
					class="glass big-text"
				>
					{{ loading ? '' : 'reset password' }}
				</button>

				<footer>
					<RouterLink to="/login">back to sign in</RouterLink>
				</footer>
			</template>
		</article>
	</div>
</template>

<style scoped>
article {
	width: 100%;
	max-width: 380px;
	grid-column: span 4;
	padding: 8px;
}

hgroup {
	margin-bottom: var(--pico-spacing);
}

hgroup h1 {
	margin-bottom: 0;
}

hgroup p {
	margin-bottom: 0;
	color: var(--pico-muted-color);
}

button {
	width: 100%;
}

.error-msg {
	color: var(--pico-del-color);
	background: color-mix(in srgb, var(--pico-del-color) 10%, transparent);
	border: 1px solid color-mix(in srgb, var(--pico-del-color) 30%, transparent);
	padding: 0.5rem 0.75rem;
	border-radius: var(--pico-border-radius);
	font-size: 0.875rem;
}

.success-msg {
	color: var(--green-600);
	background: color-mix(in srgb, var(--green-500) 10%, transparent);
	border: 1px solid color-mix(in srgb, var(--green-500) 30%, transparent);
	padding: 0.5rem 0.75rem;
	border-radius: var(--pico-border-radius);
	font-size: 0.875rem;
}

footer {
	margin-top: var(--pico-spacing);
	text-align: center;
	font-size: 0.875rem;
	color: var(--pico-muted-color);
}
</style>

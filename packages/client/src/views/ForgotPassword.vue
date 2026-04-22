<!--
Forgot Password View
Lets an unauthenticated user request a password reset email.
better-auth's forgetPassword endpoint handles token generation & expiry.

CREATED ON: 17APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { ref } from 'vue'
import { authClient } from '@/lib/auth-client'
import { useToastStore } from '@/stores/toast'

const email = ref('')
const error = ref('')
const sent = ref(false)
const loading = ref(false)

async function handleSubmit() {
	error.value = ''
	loading.value = true

	const { error: authError } = await authClient.requestPasswordReset({
		email: email.value,
		redirectTo: '/reset-password',
	})

	loading.value = false

	if (authError) {
		const msg = authError.message ?? 'Could not send reset email. Please try again.'
		error.value = msg
		useToastStore().show(msg, 'error')
	} else {
		sent.value = true
	}
}
</script>

<template>
	<div class="dashboard">
		<article>
			<!-- Sent state -->
			<template v-if="sent">
				<hgroup>
					<h1>Check your email</h1>
					<p>if an account exists, a reset link is on its way</p>
				</hgroup>
				<p class="success-msg">
					We've sent a password reset link to <strong>{{ email }}</strong
					>. The link expires in 1 hour.
				</p>
				<footer>
					<RouterLink to="/login">back to sign in</RouterLink>
				</footer>
			</template>

			<!-- Request state -->
			<template v-else>
				<hgroup>
					<h1>Forgot password</h1>
					<p>we'll send you a reset link</p>
				</hgroup>

				<p v-if="error" class="error-msg">{{ error }}</p>

				<label for="email">
					email
					<input
						id="email"
						v-model="email"
						type="email"
						placeholder="you@example.com"
						autocomplete="email"
						required
					/>
				</label>

				<button
					:aria-busy="loading"
					:disabled="loading || !email"
					@click="handleSubmit"
					class="glass big-text"
				>
					{{ loading ? '' : 'send reset link' }}
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
	line-height: 1.5;
}

footer {
	margin-top: var(--pico-spacing);
	text-align: center;
	font-size: 0.875rem;
	color: var(--pico-muted-color);
}
</style>

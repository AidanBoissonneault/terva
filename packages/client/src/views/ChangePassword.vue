<!--
Change Password View
Allows a logged-in user to update their password.

CREATED ON: 09APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { useToastStore } from '@/stores/toast'

const router = useRouter()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function handleChangePassword() {
	error.value = ''
	success.value = false

	if (newPassword.value !== confirmPassword.value) {
		error.value = 'New passwords do not match.'
		return
	}

	if (newPassword.value.length < 8) {
		error.value = 'New password must be at least 8 characters.'
		return
	}

	loading.value = true

	const { error: authError } = await authClient.changePassword({
		currentPassword: currentPassword.value,
		newPassword: newPassword.value,
	})

	loading.value = false

	if (authError) {
		const msg = authError.message ?? 'Failed to change password. Check your current password.'
		error.value = msg
		useToastStore().show(msg, 'error')
	} else {
		success.value = true
		useToastStore().show('Password updated.', 'success')
		setTimeout(() => router.push({ name: 'profile' }), 1500)
	}
}
</script>

<template>
	<div class="dashboard">
		<article>
			<hgroup>
				<h1>Change password</h1>
				<p>enter your current password to continue</p>
			</hgroup>

			<p v-if="error" class="error-msg">{{ error }}</p>
			<p v-if="success" class="success-msg">Password updated. Redirecting...</p>

			<label for="current-password">
				current password
				<input
					id="current-password"
					v-model="currentPassword"
					type="password"
					placeholder="••••••••"
					autocomplete="current-password"
					required
				/>
			</label>

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
				:disabled="loading || !currentPassword || !newPassword || !confirmPassword"
				@click="handleChangePassword"
				class="glass big-text"
			>
				{{ loading ? '' : 'update password' }}
			</button>

			<footer>
				<RouterLink :to="{ name: 'profile' }">back to profile</RouterLink>
			</footer>
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

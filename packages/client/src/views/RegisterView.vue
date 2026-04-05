<!--
Register View
Used when a user is signing up for Terva

CREATED ON: 04APR2026
LAST EDITED: 04APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/lib/auth-client";

const router = useRouter()
const name = ref("")
const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

async function handleRegister() {
	error.value = ""
	loading.value = true

	const { error: authError } = await authClient.signUp.email({
		name: name.value,
		email: email.value,
		password: password.value,
	})

	loading.value = false

	if (authError) {
		error.value = authError.message ?? "Registration failed."
		return;
	}

	router.push("/")
}
</script>

<template>
	<div class="dashboard">
		<article>
			<hgroup>
				<h1>Create account</h1>
				<p>or <RouterLink to="/login">sign in</RouterLink>
				</p>
			</hgroup>

			<p v-if="error" class="error-msg">{{ error }}</p>

			<label for="name">
				name
				<input id="name" v-model="name" type="text" placeholder="your name" autocomplete="name" required />
			</label>

			<label for="email">
				email
				<input id="email" v-model="email" type="email" placeholder="you@example.com" autocomplete="email" required />
			</label>

			<label for="password">
				password
				<input id="password" v-model="password" type="password" placeholder="min. 8 characters"
					autocomplete="new-password" required />
			</label>

			<button :aria-busy="loading" :disabled="loading" @click="handleRegister" class="glass big-text">
				{{ loading ? "" : "create account" }}
			</button>

			<footer>
				already have one? <RouterLink to="/login">sign in</RouterLink>
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

.seed-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
	color: var(--pico-muted-color);
	cursor: pointer;
	margin-bottom: 0;
}

.seed-label input[type="checkbox"] {
	margin: 0;
	width: auto;
}

.error-msg {
	color: var(--pico-del-color);
	background: color-mix(in srgb, var(--pico-del-color) 10%, transparent);
	border: 1px solid color-mix(in srgb, var(--pico-del-color) 30%, transparent);
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

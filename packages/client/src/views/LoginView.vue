<!--
Login View
Used when a user is logging into Terva

CREATED ON: 04APR2026
LAST EDITED: 17APR2026
By: Aidan Boissonneault
-->

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/lib/auth-client";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleLogin() {
	error.value = "";
	loading.value = true;

	const { error: authError } = await authClient.signIn.email({
		email: email.value,
		password: password.value,
	});

	loading.value = false;

	if (authError) {
		error.value = authError.message ?? "Login failed.";
	} else {
		router.push("/");
	}
}
</script>

<template>
	<div class="dashboard">
		<article>
			<hgroup>
				<h1>Sign in</h1>
				<p>or create an account</p>
			</hgroup>

			<p v-if="error" class="error-msg">{{ error }}</p>

			<label for="email">
				email
				<input id="email" v-model="email" type="email" placeholder="you@example.com" autocomplete="email" required />
			</label>

			<label for="password">
				password
				<input id="password" v-model="password" type="password" placeholder="••••••••" autocomplete="current-password"
					required />
			</label>

			<button :aria-busy="loading" :disabled="loading" @click="handleLogin" class="glass big-text">
				{{ loading ? "" : "sign in" }}
			</button>

			<footer>
				<RouterLink to="/forgot-password" class="forgot-link">forgot password?</RouterLink>
				<span class="separator">·</span>
				no account? <RouterLink to="/register">register</RouterLink>
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
	background: var(--pico-del-color);
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

.separator {
	margin: 0 0.4em;
}
</style>

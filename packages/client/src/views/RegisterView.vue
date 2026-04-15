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
import BottomSheet from "@/components/Utils/BottomSheet.vue";
import TermsAndCondtions from "./TermsAndCondtions.vue";
import PrivacyPolicy from "./PrivacyPolicy.vue";

const router = useRouter()
const name = ref("")
const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

const showPrivacyPolicy = ref(false)
const showTermsAndConditions = ref(false)

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

	router.push("/login")
}
</script>

<template>
	<div class="dashboard">
		<form @submit.prevent="handleRegister">
			<article>
				<hgroup>
					<h1>Create account</h1>
					<p>or <RouterLink to="/login">sign in</RouterLink>
					</p>
				</hgroup>

				<p v-if="error" class="error-msg">{{ error }}</p>

				<label>
					name
					<input id="name" v-model="name" type="text" placeholder="your name" autocomplete="name" required />
				</label>

				<label>
					email
					<input id="email" v-model="email" type="email" placeholder="you@example.com" autocomplete="email" required />
				</label>

				<label>
					password
					<input id="password" v-model="password" type="password" placeholder="min. 8 characters"
						autocomplete="new-password" required />
				</label>

				<div>
					<input type="checkbox" required class="agree-button">
					I agree to the <a @click="showTermsAndConditions = !showTermsAndConditions">Terms and Condtions</a> and <a
						@click="showPrivacyPolicy = !showPrivacyPolicy">Privacy Policy</a>.
				</div>

				<button :aria-busy="loading" :disabled="loading" class="glass big-text">
					{{ loading ? "" : "create account" }}
				</button>

				<footer>
					already have one? <RouterLink to="/login">sign in</RouterLink>
				</footer>
			</article>

		</form>
	</div>

	<BottomSheet v-model="showPrivacyPolicy" title="Privacy Policy">
		<PrivacyPolicy/>
	</BottomSheet>

	<BottomSheet v-model="showTermsAndConditions" title="Terms and Conditions">
		<TermsAndCondtions/>
	</BottomSheet>
</template>

<style scoped>
form {
	grid-column: span 4;
}

article {
	width: 100%;
	max-width: 380px;
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

.agree-button {
	border: 2px solid var(--brand-300);
}
</style>

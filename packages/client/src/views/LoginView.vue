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
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">terva</h1>
      <p class="auth-sub">sign in to your account</p>

      <div v-if="error" class="auth-error">{{ error }}</div>

      <div class="auth-form">
        <label>email</label>
        <input v-model="email" type="email" placeholder="you@example.com" />

        <label>password</label>
        <input v-model="password" type="password" placeholder="••••••••" />

        <button :disabled="loading" @click="handleLogin">
          {{ loading ? "signing in…" : "sign in" }}
        </button>
      </div>

      <p class="auth-link">
        no account? <RouterLink to="/register">register</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Adapt to your Terva design tokens */
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--color-bg, #0a0a0a);
}
.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  border: 1px solid var(--color-border, #2a2a2a);
  border-radius: 4px;
  background: var(--color-surface, #111);
}
.auth-title {
  font-family: var(--font-display, "Canela", serif);
  font-size: 2rem;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}
.auth-sub {
  color: var(--color-muted, #888);
  font-size: 0.875rem;
  margin-bottom: 2rem;
}
.auth-error {
  background: #2a1212;
  border: 1px solid #5a2020;
  color: #f88;
  padding: 0.75rem 1rem;
  border-radius: 3px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.auth-form label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted, #888);
  margin-top: 0.5rem;
}
.auth-form input {
  background: var(--color-input-bg, #1a1a1a);
  border: 1px solid var(--color-border, #2a2a2a);
  border-radius: 3px;
  padding: 0.625rem 0.875rem;
  color: inherit;
  font-size: 0.9rem;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
}
.auth-form input:focus {
  border-color: var(--color-accent, #c8a96e);
}
.auth-form button {
  margin-top: 1.25rem;
  padding: 0.75rem;
  background: var(--color-accent, #c8a96e);
  color: #000;
  border: none;
  border-radius: 3px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.15s;
}
.auth-form button:disabled { opacity: 0.5; cursor: not-allowed; }
.auth-link {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--color-muted, #888);
  text-align: center;
}
.auth-link a { color: var(--color-accent, #c8a96e); text-decoration: none; }
</style>

import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? "https://www.tervabrewed.com",
});

// Named exports for convenience
export const { signIn, signUp, signOut, useSession } = authClient;

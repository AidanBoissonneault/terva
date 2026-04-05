import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const session = authClient.useSession(); // reactive Ref

  async function logout() {
    await authClient.signOut();
    window.location.href = "/login";
  }

  return {
    session,           // session.data?.user, session.isPending, session.error
    user: session,     // convenience alias
    logout,
  };
}

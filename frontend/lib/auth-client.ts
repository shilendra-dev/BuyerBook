import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3001/api/auth",
});

// Export the auth methods
export const { signIn, signUp, signOut, useSession, getSession } = authClient;

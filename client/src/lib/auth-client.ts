import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance.
 *
 * The baseURL points to our Express server which hosts the /api/auth/* handler.
 * If the Next.js app and Express server are on the same domain in production,
 * you can remove baseURL and let Better Auth infer it.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Named exports for convenience (mirrors the Better Auth React client API)
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

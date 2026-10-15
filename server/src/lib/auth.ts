import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

/**
 * Returns the native MongoDB `Db` instance extracted from the
 * Mongoose connection. Calling this lazily ensures Mongoose is
 * already connected before Better Auth tries to use it.
 */
function getNativeDb() {
  const dbName = process.env.DB_NAME || "learningdb";
  const client = mongoose.connection.getClient();
  return client.db(dbName);
}

// ---------------------------------------------------------------------------
// Better Auth instance
// We use a lazy-init approach: the mongodbAdapter receives the Db reference
// at first request time via a Proxy so Mongoose is guaranteed to be connected.
// ---------------------------------------------------------------------------
const dbProxy = new Proxy({} as ReturnType<typeof getNativeDb>, {
  get(_target, prop) {
    const db = getNativeDb();
    const value = (db as any)[prop];
    return typeof value === "function" ? value.bind(db) : value;
  },
});

export const auth = betterAuth({
  // ---------------------------------------------------------------------------
  // Database – MongoDB via Mongoose native client
  // ---------------------------------------------------------------------------
  database: mongodbAdapter(dbProxy),

  // ---------------------------------------------------------------------------
  // Authentication methods (FR-AUTH-01)
  // ---------------------------------------------------------------------------
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // set to true when email plugin is added
    minPasswordLength: 6,
  },

  // ---------------------------------------------------------------------------
  // Session configuration
  // ---------------------------------------------------------------------------
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // refresh session if <1 day left
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,              // cache for 5 minutes
    },
  },

  // ---------------------------------------------------------------------------
  // Extend the built-in user model with LMS-specific fields
  // ---------------------------------------------------------------------------
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
        input: true,
      },
      bio: {
        type: "string",
        defaultValue: "",
        input: true,
      },
      phone: {
        type: "string",
        defaultValue: "",
        input: true,
      },
      avatarUrl: {
        type: "string",
        defaultValue: "",
        input: true,
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Trusted origins – add production domain here when deploying
  // ---------------------------------------------------------------------------
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
});

export type Auth = typeof auth;

import { randomBytes } from "node:crypto";

type Env = Record<string, string | undefined>;

const globalStore = globalThis as typeof globalThis & { __portfolioDevSecret?: string };

/**
 * HMAC key for form tokens and cancel tokens.
 * Production requires BOOKING_SIGNING_SECRET (null => the API answers 503).
 * Local dev falls back to a random per-process key, so tokens simply stop
 * verifying after a restart.
 */
export function getSigningSecret(env: Env = process.env): string | null {
  const configured = env.BOOKING_SIGNING_SECRET?.trim();
  if (configured && configured.length >= 32) return configured;
  if (env.NODE_ENV === "production" || env.VERCEL) return null;
  globalStore.__portfolioDevSecret ??= randomBytes(32).toString("hex");
  return globalStore.__portfolioDevSecret;
}

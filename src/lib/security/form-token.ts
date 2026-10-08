import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless "form opened at" token: `<issuedAtMs>.<hmac>`.
 * Lets the server reject submissions that arrive implausibly fast (bots)
 * or with a stale/forged timestamp, without CAPTCHA and without storage.
 */
export const FORM_TOKEN_MIN_AGE_MS = 3_000;
export const FORM_TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export type FormTokenVerdict = "ok" | "too_fast" | "expired" | "invalid";

function sign(issuedAt: string, secret: string): string {
  return createHmac("sha256", secret).update(`form-token|${issuedAt}`).digest("base64url");
}

export function issueFormToken(secret: string, now: number = Date.now()): string {
  const issuedAt = String(Math.floor(now));
  return `${issuedAt}.${sign(issuedAt, secret)}`;
}

export function verifyFormToken(
  token: string,
  secret: string,
  now: number = Date.now(),
): FormTokenVerdict {
  const dot = token.indexOf(".");
  if (dot <= 0) return "invalid";
  const issuedAt = token.slice(0, dot);
  const signature = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(issuedAt, secret));
  if (!/^\d{1,16}$/.test(issuedAt)) return "invalid";
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) {
    return "invalid";
  }
  const age = now - Number(issuedAt);
  if (age < FORM_TOKEN_MIN_AGE_MS) return "too_fast";
  if (age > FORM_TOKEN_MAX_AGE_MS) return "expired";
  return "ok";
}

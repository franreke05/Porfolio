import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless cancellation capability: `<b64url(start.nonce.exp)>.<hmac>`.
 * - `start` identifies the slot (the provider derives its event id from it).
 * - `nonce` is the random value stored on the live event, so a token for a
 *   cancelled booking cannot cancel whoever books that slot afterwards.
 * - `exp` is the slot start: a meeting cannot be cancelled once it began.
 */
export type CancelClaims = { start: number; nonce: string; exp: number };

const NONCE_RE = /^[a-f0-9]{16,64}$/;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`cancel-token|${payload}`).digest("base64url");
}

export function createCancelToken(claims: CancelClaims, secret: string): string {
  const payload = Buffer.from(`${claims.start}.${claims.nonce}.${claims.exp}`).toString(
    "base64url",
  );
  return `${payload}.${sign(payload, secret)}`;
}

/** Returns the claims, or null for anything malformed, forged or expired. */
export function verifyCancelToken(
  token: string,
  secret: string,
  now: number = Date.now(),
): CancelClaims | null {
  if (typeof token !== "string" || token.length > 512) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload, secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  const fields = Buffer.from(payload, "base64url").toString("utf8").split(".");
  if (fields.length !== 3) return null;
  const start = Number(fields[0]);
  const nonce = fields[1];
  const exp = Number(fields[2]);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(exp)) return null;
  if (!NONCE_RE.test(nonce)) return null;
  if (now >= exp) return null;
  return { start, nonce, exp };
}

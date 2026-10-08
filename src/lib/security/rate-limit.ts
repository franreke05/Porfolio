import { createHash } from "node:crypto";

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export interface RateLimiter {
  /** Records one hit for `key` and reports whether it is within `limit` per `windowMs`. */
  hit(key: string, limit: number, windowMs: number, now?: number): RateLimitResult;
}

/**
 * Sliding-window limiter held in process memory.
 * HONEST LIMITATION: state is per server instance and is lost on cold start,
 * so on serverless this is best-effort abuse damping, not a guarantee.
 * The cross-instance cap is the Vercel WAF rule (see README).
 */
export class MemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, number[]>();
  private readonly maxKeys: number;

  constructor(maxKeys = 5000) {
    this.maxKeys = maxKeys;
  }

  hit(key: string, limit: number, windowMs: number, now: number = Date.now()): RateLimitResult {
    const cutoff = now - windowMs;
    const recent = (this.hits.get(key) ?? []).filter((ts) => ts > cutoff);

    if (recent.length >= limit) {
      this.hits.set(key, recent);
      const retryAfterMs = recent[0] + windowMs - now;
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
    }

    recent.push(now);
    this.hits.delete(key); // re-insert so the Map keeps recency order
    this.hits.set(key, recent);
    if (this.hits.size > this.maxKeys) {
      const oldest = this.hits.keys().next().value;
      if (oldest !== undefined) this.hits.delete(oldest);
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/** Rate-limit key for a client: salted hash, so the raw IP is never kept. */
export function hashClientKey(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}|${ip}`).digest("hex").slice(0, 32);
}

const globalStore = globalThis as typeof globalThis & {
  __portfolioRateLimiter?: MemoryRateLimiter;
};

/** Process-wide limiter (kept on globalThis so dev hot reload does not reset it). */
export function getRateLimiter(): RateLimiter {
  globalStore.__portfolioRateLimiter ??= new MemoryRateLimiter();
  return globalStore.__portfolioRateLimiter;
}

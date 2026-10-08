/**
 * Origin allowlist for mutating route handlers.
 * Next.js checks Origin vs Host for Server Actions only; route handlers get
 * no built-in CSRF protection, so we do the equivalent check ourselves.
 */
type Env = Record<string, string | undefined>;

function normalize(origin: string): string | null {
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin.toLowerCase();
  } catch {
    return null;
  }
}

/** Origins allowed by configuration (the same-host rule is applied separately). */
export function configuredOrigins(env: Env): string[] {
  const origins: string[] = [];
  const add = (value: string | undefined, assumeHttps = false) => {
    if (!value) return;
    const normalized = normalize(assumeHttps ? `https://${value}` : value);
    if (normalized) origins.push(normalized);
  };
  add(env.SITE_ORIGIN);
  // Vercel system variables are bare hosts without a scheme.
  add(env.VERCEL_URL, true);
  add(env.VERCEL_BRANCH_URL, true);
  add(env.VERCEL_PROJECT_PRODUCTION_URL, true);
  return origins;
}

/**
 * True when `origin` is allowlisted or is the very host that served the request.
 * A missing Origin is rejected: browsers always send it on cross-site and on
 * same-origin POST fetches.
 */
export function isAllowedOrigin(
  origin: string | null,
  requestHost: string | null,
  allowed: readonly string[],
): boolean {
  if (!origin) return false;
  const normalized = normalize(origin);
  if (!normalized) return false;
  if (allowed.includes(normalized)) return true;
  if (!requestHost) return false;
  return new URL(normalized).host === requestHost.trim().toLowerCase();
}

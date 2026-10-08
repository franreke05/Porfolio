import type { ApiErrorBody, ApiErrorCode, ApiFieldErrors } from "../booking/contract";
import { configuredOrigins, isAllowedOrigin } from "../security/origin";
import { getRateLimiter, hashClientKey } from "../security/rate-limit";

/** Shared response + request-guard helpers for the route handlers. */
const STATUS: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  REJECTED: 400,
  INVALID_TOKEN: 400,
  FORBIDDEN_ORIGIN: 403,
  SLOT_UNAVAILABLE: 409,
  RATE_LIMITED: 429,
  PROVIDER_ERROR: 502,
  PROVIDER_NOT_CONFIGURED: 503,
};

const MESSAGE: Record<ApiErrorCode, string> = {
  VALIDATION_ERROR: "Revisa los campos marcados antes de enviar.",
  REJECTED: "No se ha podido procesar el envío. Recarga la página e inténtalo de nuevo.",
  INVALID_TOKEN: "El enlace de cancelación no es válido o ha caducado.",
  FORBIDDEN_ORIGIN: "Solicitud no permitida.",
  SLOT_UNAVAILABLE: "Esa hora acaba de ocuparse. Elige otra, por favor.",
  RATE_LIMITED: "Demasiados intentos. Espera un momento y vuelve a probar.",
  PROVIDER_ERROR:
    "Ahora mismo no puedo completar la operación. Escríbeme por email o llámame y lo resolvemos.",
  PROVIDER_NOT_CONFIGURED:
    "Este canal todavía no está disponible. Escríbeme por email o llámame directamente.",
};

const BASE_HEADERS = { "Cache-Control": "no-store" } as const;

export function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return Response.json(data, { status, headers: { ...BASE_HEADERS, ...headers } });
}

export function apiError(
  code: ApiErrorCode,
  options: {
    message?: string;
    fieldErrors?: ApiFieldErrors;
    retryAfterSeconds?: number;
    extra?: Record<string, unknown>;
  } = {},
): Response {
  const body: ApiErrorBody = {
    error: {
      code,
      message: options.message ?? MESSAGE[code],
      ...(options.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
      ...(options.retryAfterSeconds ? { retryAfterSeconds: options.retryAfterSeconds } : {}),
    },
  };
  const headers = options.retryAfterSeconds
    ? { "Retry-After": String(options.retryAfterSeconds) }
    : undefined;
  return json({ ...body, ...options.extra }, STATUS[code], headers);
}

/**
 * Structured, PII-free log line. Only codes and opaque references are allowed
 * here: never request bodies, emails, phones, IPs or provider payloads.
 */
export function logEvent(event: {
  route: string;
  code: string;
  channel?: string;
  ref?: string;
  providerStatus?: number;
}): void {
  console.error(JSON.stringify({ scope: "contact-api", ...event }));
}

/** Salted hash of the caller's address, used only as a rate-limit key. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.BOOKING_SIGNING_SECRET || "portfolio-local-salt";
  return hashClientKey(ip, salt);
}

function devMultiplier(): number {
  if (process.env.NODE_ENV === "production") return 1;
  const value = Number(process.env.RATE_LIMIT_DEV_MULTIPLIER);
  return Number.isFinite(value) && value >= 1 ? Math.min(value, 1000) : 1;
}

export type Limit = { bucket: string; limit: number; windowMs: number };

/** Returns a 429 response when the caller exceeded `limit`, otherwise null. */
export function rateLimit(request: Request, limit: Limit, key = clientKey(request)): Response | null {
  const result = getRateLimiter().hit(
    `${limit.bucket}:${key}`,
    limit.limit * devMultiplier(),
    limit.windowMs,
  );
  return result.allowed
    ? null
    : apiError("RATE_LIMITED", { retryAfterSeconds: result.retryAfterSeconds });
}

const MAX_BODY_BYTES = 16 * 1024;

/**
 * Gate for every mutating handler: same-site Origin, JSON content type (forces
 * a CORS preflight for cross-site callers; we emit no CORS headers), attempt
 * rate limit, bounded body. Returns the parsed JSON object or an error response.
 */
export async function guardPost(
  request: Request,
  attempts: Limit,
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; response: Response }> {
  const allowed = isAllowedOrigin(
    request.headers.get("origin"),
    request.headers.get("host"),
    configuredOrigins(process.env),
  );
  if (!allowed) return { ok: false, response: apiError("FORBIDDEN_ORIGIN") };

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return {
      ok: false,
      response: apiError("VALIDATION_ERROR", { message: "Formato de solicitud no admitido." }),
    };
  }

  const limited = rateLimit(request, attempts);
  if (limited) return { ok: false, response: limited };

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, response: apiError("VALIDATION_ERROR") };
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: apiError("VALIDATION_ERROR", { message: "La solicitud es demasiado grande." }),
    };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, response: apiError("VALIDATION_ERROR") };
  }
}

/** True when the honeypot field was filled (a human never sees it). */
export function honeypotTripped(body: Record<string, unknown>): boolean {
  return typeof body.website === "string" && body.website.trim() !== "";
}

import { bookingConfig } from "../config";
import type { CalendarProvider } from "../provider";
import { GoogleCalendarProvider } from "./google";
import { MemoryCalendarProvider, parseDevBusy } from "./memory";

type Env = Record<string, string | undefined>;

export type ProviderChoice =
  | { kind: "google" }
  | { kind: "memory" }
  | { kind: "none"; reason: "missing_credentials" | "memory_forbidden_in_production" };

export function isProductionEnv(env: Env): boolean {
  return env.VERCEL_ENV === "production" || (!env.VERCEL_ENV && env.NODE_ENV === "production");
}

/**
 * Decides which calendar adapter may answer. Pure, so it is unit-testable.
 * - google: only with the full credential set.
 * - memory: only when explicitly requested AND never in production.
 * - none: the API answers 503 PROVIDER_NOT_CONFIGURED (no fake success).
 */
export function chooseProvider(env: Env): ProviderChoice {
  const requested = (env.CALENDAR_PROVIDER ?? "").trim().toLowerCase();
  const hasGoogle = Boolean(
    env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET && env.GOOGLE_OAUTH_REFRESH_TOKEN,
  );

  if (requested === "memory") {
    if (isProductionEnv(env) || env.NODE_ENV === "production") {
      return { kind: "none", reason: "memory_forbidden_in_production" };
    }
    return { kind: "memory" };
  }
  if (hasGoogle) return { kind: "google" };
  return { kind: "none", reason: "missing_credentials" };
}

const globalStore = globalThis as typeof globalThis & {
  __portfolioCalendar?: { key: string; provider: CalendarProvider };
};

/** Process-wide provider instance, or null when nothing is configured. */
export function getCalendarProvider(env: Env = process.env): CalendarProvider | null {
  const choice = chooseProvider(env);
  if (choice.kind === "none") return null;

  // Rebuild when the relevant configuration changes (dev env hot reload).
  const key =
    choice.kind === "memory"
      ? `memory|${env.BOOKING_DEV_BUSY ?? ""}`
      : `google|${env.GOOGLE_CALENDAR_ID ?? ""}|${(env.GOOGLE_OAUTH_REFRESH_TOKEN ?? "").length}`;
  const cached = globalStore.__portfolioCalendar;
  if (cached && cached.key === key) return cached.provider;

  const provider: CalendarProvider =
    choice.kind === "memory"
      ? new MemoryCalendarProvider(
          parseDevBusy(env.BOOKING_DEV_BUSY, bookingConfig.slotMinutes, bookingConfig.timeZone),
        )
      : new GoogleCalendarProvider({
          clientId: env.GOOGLE_OAUTH_CLIENT_ID as string,
          clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET as string,
          refreshToken: env.GOOGLE_OAUTH_REFRESH_TOKEN as string,
          calendarId: env.GOOGLE_CALENDAR_ID?.trim() || "primary",
          bufferMinutes: bookingConfig.bufferMinutes,
          summaryPrefix: "Reunión",
        });
  globalStore.__portfolioCalendar = { key, provider };
  return provider;
}

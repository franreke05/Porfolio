import { randomBytes } from "node:crypto";
import { createCancelToken } from "@/lib/booking/cancel-token";
import { bookingConfig } from "@/lib/booking/config";
import type { BookingResponse, DayDto } from "@/lib/booking/contract";
import { buildIcs } from "@/lib/booking/ics";
import { ProviderError } from "@/lib/booking/provider";
import type { CalendarProvider } from "@/lib/booking/provider";
import { getCalendarProvider } from "@/lib/booking/providers";
import { findSlot, generateAvailability, queryWindow } from "@/lib/booking/slots";
import { civilDateIn } from "@/lib/booking/time";
import {
  apiError,
  guardPost,
  honeypotTripped,
  json,
  logEvent,
  rateLimit,
} from "@/lib/http/respond";
import { PRIVACY_POLICY_VERSION } from "@/lib/leads/model";
import type { VideoMeetingLead } from "@/lib/leads/model";
import { bookingRequestSchema, fieldErrorsOf } from "@/lib/leads/schemas";
import { submitLead } from "@/lib/leads/sink";
import { getLeadSinks } from "@/lib/leads/sinks/email";
import { verifyFormToken } from "@/lib/security/form-token";
import { configuredOrigins } from "@/lib/security/origin";
import { getSigningSecret } from "@/lib/security/secret";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "booking";
const HOUR = 60 * 60 * 1000;

/** Fresh availability for one civil date, so the UI can re-render after a conflict. */
async function refreshedDay(
  provider: CalendarProvider,
  date: string,
  now: number,
): Promise<DayDto | undefined> {
  try {
    const range = { from: date, days: 1 };
    const busy = await provider.freeBusy(queryWindow(range));
    const day = generateAvailability(bookingConfig, range, busy, now)[0];
    return {
      date,
      slots: (day?.slots ?? []).map((slot) => ({
        start: new Date(slot.start).toISOString(),
        end: new Date(slot.end).toISOString(),
      })),
    };
  } catch {
    return undefined;
  }
}

export async function POST(request: Request): Promise<Response> {
  const guarded = await guardPost(request, {
    bucket: "booking-attempt",
    limit: 10,
    windowMs: 10 * 60_000,
  });
  if (!guarded.ok) return guarded.response;

  if (honeypotTripped(guarded.body)) return apiError("REJECTED");

  const parsed = bookingRequestSchema.safeParse(guarded.body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", { fieldErrors: fieldErrorsOf(parsed.error) });
  }
  const input = parsed.data;

  const secret = getSigningSecret();
  const provider = getCalendarProvider();
  if (!secret || !provider) return apiError("PROVIDER_NOT_CONFIGURED");

  if (verifyFormToken(input.formToken, secret) !== "ok") return apiError("REJECTED");

  const now = Date.now();
  const startMs = Date.parse(input.start);
  const date = civilDateIn(startMs, bookingConfig.timeZone);

  // The server regenerates the grid: a start that is not one of OUR slots is refused.
  const slot = findSlot(bookingConfig, startMs, now);
  if (!slot) {
    return apiError("SLOT_UNAVAILABLE", { extra: { day: await refreshedDay(provider, date, now) } });
  }

  // Creation limits: per visitor, plus a global daily cap so the calendar cannot be flooded.
  const perClient = rateLimit(request, { bucket: "booking-create", limit: 3, windowMs: HOUR });
  if (perClient) return perClient;
  const global = rateLimit(
    request,
    { bucket: "booking-create-global", limit: 6, windowMs: 24 * HOUR },
    "all",
  );
  if (global) return global;

  const ref = `V-${randomBytes(5).toString("hex").toUpperCase()}`;
  const nonce = randomBytes(16).toString("hex");
  const cancelToken = createCancelToken({ start: slot.start, nonce, exp: slot.start }, secret);
  const siteOrigin = configuredOrigins({ SITE_ORIGIN: process.env.SITE_ORIGIN })[0];

  let meetUrl: string | null;
  try {
    const result = await provider.reserve({
      slot,
      nonce,
      ref,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      intent: input.intent,
      visitorTimeZone: input.visitorTimeZone,
      // Fragment, not query: the token never reaches server or proxy logs.
      cancelUrl: siteOrigin ? `${siteOrigin}/contacto/cancelar#t=${cancelToken}` : undefined,
    });
    if (!result.ok) {
      return apiError("SLOT_UNAVAILABLE", {
        extra: { day: await refreshedDay(provider, date, now) },
      });
    }
    meetUrl = result.meetUrl;
  } catch (error) {
    logEvent({
      route: ROUTE,
      code: "PROVIDER_ERROR",
      channel: "VIDEO_MEETING",
      ref,
      providerStatus: error instanceof ProviderError ? error.status : undefined,
    });
    return apiError("PROVIDER_ERROR");
  }

  const startIso = new Date(slot.start).toISOString();
  const endIso = new Date(slot.end).toISOString();
  const createdAt = new Date(now).toISOString();

  const lead: VideoMeetingLead = {
    channel: "VIDEO_MEETING",
    ref,
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    intent: input.intent,
    start: startIso,
    end: endIso,
    visitorTimeZone: input.visitorTimeZone,
    meetUrl,
    consent: { at: createdAt, policyVersion: PRIVACY_POLICY_VERSION },
    createdAt,
  };

  // The calendar event is the record; a failed notification degrades, it does not undo.
  const sinks = getLeadSinks(bookingConfig.timeZone);
  const report = await submitLead(lead, sinks);
  const notified = report.delivered.length > 0 && report.failed.length === 0;
  if (!notified) logEvent({ route: ROUTE, code: "NOTIFICATION_DEGRADED", ref });

  const body: BookingResponse = {
    status: "confirmed",
    mode: provider.mode,
    booking: {
      ref,
      start: startIso,
      end: endIso,
      timezone: bookingConfig.timeZone,
      meetUrl,
      ics: buildIcs({
        uid: `${ref.toLowerCase()}@francisco-requena-portfolio`,
        start: slot.start,
        end: slot.end,
        stamp: now,
        summary: "Reunión con Francisco Requena",
        description: `Referencia ${ref}.`,
        url: meetUrl,
      }),
      cancelToken,
    },
    notification: notified ? "sent" : "degraded",
  };
  return json(body, 201);
}

import { createHash } from "node:crypto";
import { ProviderError } from "../provider";
import type { CalendarProvider, CancelResult, ReserveInput, ReserveResult } from "../provider";
import type { Interval } from "../slots";

/**
 * Google Calendar v3 over plain fetch, authenticated with the OWNER's OAuth
 * refresh token (a service account cannot create Meet links or invite guests
 * on a consumer Gmail calendar).
 *
 * Atomic reservation without a database:
 *   1. re-check free/busy for the slot;
 *   2. insert with a DETERMINISTIC event id derived from the slot start, so a
 *      second insert for the same slot is rejected (409);
 *   3. read the event back and compare our random nonce — Google documents
 *      that id collisions are not guaranteed to be detected at creation time,
 *      so the read-back is the real arbiter;
 *   4. a 409 on a previously CANCELLED event is revived with a conditional
 *      update (If-Match etag): of two concurrent revivers one gets 412.
 */
export type GoogleCalendarConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
  bufferMinutes: number;
  /** Shown as the event title. */
  summaryPrefix: string;
};

type GoogleEvent = {
  id?: string;
  etag?: string;
  status?: string;
  hangoutLink?: string;
  conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
  extendedProperties?: { private?: Record<string, string> };
};

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";
const TIMEOUT_MS = 8000;

/** Deterministic event id for a slot: hex is a subset of Google's base32hex alphabet. */
export function eventIdForSlot(calendarId: string, slotStart: number): string {
  return createHash("sha256").update(`${calendarId}|${slotStart}`).digest("hex");
}

function meetUrlOf(event: GoogleEvent): string | null {
  if (event.hangoutLink) return event.hangoutLink;
  const video = event.conferenceData?.entryPoints?.find(
    (entry) => entry.entryPointType === "video" && entry.uri,
  );
  return video?.uri ?? null;
}

export class GoogleCalendarProvider implements CalendarProvider {
  readonly mode = "live" as const;
  private readonly config: GoogleCalendarConfig;
  private accessToken: { value: string; expiresAt: number } | null = null;

  constructor(config: GoogleCalendarConfig) {
    this.config = config;
  }

  private async token(): Promise<string> {
    if (this.accessToken && this.accessToken.expiresAt > Date.now() + 60_000) {
      return this.accessToken.value;
    }
    let response: Response;
    try {
      response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
          grant_type: "refresh_token",
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
    } catch {
      throw new ProviderError("google token request failed");
    }
    if (!response.ok) {
      // 400 invalid_grant here means the refresh token was revoked or expired.
      throw new ProviderError("google token refresh rejected", response.status);
    }
    const data = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) throw new ProviderError("google token response malformed");
    this.accessToken = {
      value: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3000) * 1000,
    };
    return data.access_token;
  }

  private async call(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>,
  ): Promise<Response> {
    const token = await this.token();
    try {
      return await fetch(`${API}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          ...extraHeaders,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
    } catch {
      throw new ProviderError(`google ${method} request failed`);
    }
  }

  private eventsPath(eventId?: string): string {
    const base = `/calendars/${encodeURIComponent(this.config.calendarId)}/events`;
    return eventId ? `${base}/${eventId}` : base;
  }

  async freeBusy(range: Interval): Promise<Interval[]> {
    const response = await this.call("POST", "/freeBusy", {
      timeMin: new Date(range.start).toISOString(),
      timeMax: new Date(range.end).toISOString(),
      items: [{ id: this.config.calendarId }],
    });
    if (!response.ok) throw new ProviderError("google freeBusy failed", response.status);
    const data = (await response.json()) as {
      calendars?: Record<
        string,
        { busy?: { start: string; end: string }[]; errors?: unknown[] }
      >;
    };
    const calendars = data.calendars ?? {};
    // Google may key the answer by the resolved address instead of "primary".
    const calendar = calendars[this.config.calendarId] ?? Object.values(calendars)[0];
    if (!calendar || (calendar.errors && calendar.errors.length > 0)) {
      throw new ProviderError("google freeBusy returned calendar errors");
    }
    return (calendar.busy ?? []).map((item) => ({
      start: Date.parse(item.start),
      end: Date.parse(item.end),
    }));
  }

  private eventBody(input: ReserveInput, eventId: string) {
    const description = [
      `Reserva desde el portfolio (ref ${input.ref}).`,
      `Nombre: ${input.name}`,
      `Email: ${input.email}`,
      input.phone ? `Teléfono: ${input.phone}` : null,
      `Motivo: ${input.intent}`,
      `Zona horaria del visitante: ${input.visitorTimeZone}`,
      input.message ? `\n${input.message}` : null,
      input.cancelUrl ? `\nPara cancelar la reunión: ${input.cancelUrl}` : null,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    return {
      id: eventId,
      status: "confirmed",
      summary: `${this.config.summaryPrefix} · ${input.name}`,
      description,
      start: { dateTime: new Date(input.slot.start).toISOString(), timeZone: "UTC" },
      end: { dateTime: new Date(input.slot.end).toISOString(), timeZone: "UTC" },
      attendees: [{ email: input.email, displayName: input.name }],
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      reminders: { useDefault: true },
      extendedProperties: { private: { nonce: input.nonce, ref: input.ref } },
      conferenceData: {
        createRequest: {
          requestId: input.nonce,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };
  }

  private async getEvent(eventId: string): Promise<GoogleEvent | null> {
    const response = await this.call("GET", this.eventsPath(eventId));
    if (response.status === 404) return null;
    if (!response.ok) throw new ProviderError("google events.get failed", response.status);
    return (await response.json()) as GoogleEvent;
  }

  async reserve(input: ReserveInput): Promise<ReserveResult> {
    const bufferMs = this.config.bufferMinutes * 60_000;
    const busy = await this.freeBusy({
      start: input.slot.start - bufferMs,
      end: input.slot.end + bufferMs,
    });
    const taken = busy.some(
      (interval) =>
        input.slot.start < interval.end + bufferMs && input.slot.end > interval.start - bufferMs,
    );
    if (taken) return { ok: false, reason: "conflict" };

    const eventId = eventIdForSlot(this.config.calendarId, input.slot.start);
    const body = this.eventBody(input, eventId);
    const query = "?conferenceDataVersion=1&sendUpdates=all";

    const inserted = await this.call("POST", `${this.eventsPath()}${query}`, body);

    if (inserted.status === 409) {
      // The id exists: either someone holds the slot, or it is a cancelled
      // leftover that can be revived atomically with its etag.
      const existing = await this.getEvent(eventId);
      if (!existing || existing.status !== "cancelled" || !existing.etag) {
        return { ok: false, reason: "conflict" };
      }
      const revived = await this.call("PUT", `${this.eventsPath(eventId)}${query}`, body, {
        "If-Match": existing.etag,
      });
      if (revived.status === 412 || revived.status === 409) {
        return { ok: false, reason: "conflict" };
      }
      if (!revived.ok) throw new ProviderError("google events.update failed", revived.status);
    } else if (!inserted.ok) {
      throw new ProviderError("google events.insert failed", inserted.status);
    }

    // Read-back: the stored nonce decides who really owns the slot.
    const stored = await this.getEvent(eventId);
    if (
      !stored ||
      stored.status === "cancelled" ||
      stored.extendedProperties?.private?.nonce !== input.nonce
    ) {
      return { ok: false, reason: "conflict" };
    }
    return { ok: true, meetUrl: meetUrlOf(stored) };
  }

  async cancel(slotStart: number, nonce: string): Promise<CancelResult> {
    const eventId = eventIdForSlot(this.config.calendarId, slotStart);
    const event = await this.getEvent(eventId);
    if (!event || event.extendedProperties?.private?.nonce !== nonce) return "not_found";
    if (event.status === "cancelled") return "cancelled"; // idempotent repeat

    const response = await this.call(
      "DELETE",
      `${this.eventsPath(eventId)}?sendUpdates=all`,
    );
    if (response.ok || response.status === 410) return "cancelled";
    if (response.status === 404) return "not_found";
    throw new ProviderError("google events.delete failed", response.status);
  }
}

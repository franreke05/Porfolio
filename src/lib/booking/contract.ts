/**
 * Frontend <-> API contract. TYPES ONLY: importable from client components,
 * no runtime code and no server imports.
 */
import type { Intent, PreferredTime } from "../leads/model";

export type { Intent, PreferredTime };

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "REJECTED"
  | "FORBIDDEN_ORIGIN"
  | "SLOT_UNAVAILABLE"
  | "INVALID_TOKEN"
  | "RATE_LIMITED"
  | "PROVIDER_ERROR"
  | "PROVIDER_NOT_CONFIGURED";

export type ApiFieldErrors = Record<string, string[]>;

/** Error envelope returned by every endpoint on a non-2xx status. */
export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    /** Spanish, safe to show to the visitor. */
    message: string;
    fieldErrors?: ApiFieldErrors;
    retryAfterSeconds?: number;
  };
};

/** "dev-memory" means a local demo adapter is answering: show a visible banner. */
export type ProviderMode = "live" | "dev-memory";

/** UTC ISO instants. */
export type SlotDto = { start: string; end: string };

/** `date` is a civil date (YYYY-MM-DD) in the booking time zone. */
export type DayDto = { date: string; slots: SlotDto[] };

// GET /api/form-token
export type FormTokenResponse = { token: string };

// GET /api/booking/availability?from=YYYY-MM-DD&days=14
export type AvailabilityResponse = {
  mode: ProviderMode;
  timezone: string;
  slotMinutes: number;
  generatedAt: string;
  /** Every business day in range; `slots: []` is a fully booked day. */
  days: DayDto[];
};

// POST /api/booking
export type BookingRequest = {
  /** UTC ISO instant taken verbatim from an availability slot. */
  start: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  intent?: Intent;
  /** IANA zone of the visitor, e.g. "America/Bogota". */
  visitorTimeZone: string;
  consent: true;
  formToken: string;
  /** Honeypot: must stay empty. */
  website?: string;
};

export type BookingResponse = {
  status: "confirmed";
  mode: ProviderMode;
  booking: {
    ref: string;
    start: string;
    end: string;
    timezone: string;
    /** null only if the provider has not issued the link yet (it arrives in the invitation). */
    meetUrl: string | null;
    /** Full iCalendar document; download it as a Blob (text/calendar). */
    ics: string;
    cancelToken: string;
  };
  /** "degraded": the booking exists but the notification email failed. */
  notification: "sent" | "degraded";
};

/** 409 SLOT_UNAVAILABLE also carries the refreshed day so the UI can re-render it. */
export type SlotUnavailableBody = ApiErrorBody & { day?: DayDto };

// POST /api/booking/cancel
export type CancelRequest = { token: string };
export type CancelResponse = { status: "cancelled" };

// POST /api/leads
type LeadRequestBase = {
  name: string;
  intent?: Intent;
  consent: true;
  formToken: string;
  /** Honeypot: must stay empty. */
  website?: string;
};

export type PhoneLeadRequest = LeadRequestBase & {
  channel: "PHONE";
  phone: string;
  preferredTime: PreferredTime;
  /** Only meaningful when preferredTime is "SPECIFIC" (max 80 chars). */
  preferredTimeNote?: string;
  message?: string;
};

export type EmailLeadRequest = LeadRequestBase & {
  channel: "EMAIL";
  email: string;
  projectType?: string;
  message: string;
};

export type LeadRequest = PhoneLeadRequest | EmailLeadRequest;
export type LeadResponse = { status: "received"; ref: string };

import { useCallback, useEffect, useRef } from "react";
import type {
  ApiErrorBody,
  ApiErrorCode,
  ApiFieldErrors,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  CancelResponse,
  DayDto,
  FormTokenResponse,
  LeadRequest,
  LeadResponse,
} from "@/lib/booking/contract";

/** "NETWORK" is the only code minted on the client: the request never got an answer. */
export type FailureCode = ApiErrorCode | "NETWORK";

export type ApiFailure = {
  ok: false;
  status: number;
  code: FailureCode;
  message: string;
  fieldErrors?: ApiFieldErrors;
  retryAfterSeconds?: number;
  /** Only on 409 SLOT_UNAVAILABLE. */
  day?: DayDto;
};

export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

const NETWORK_MESSAGE =
  "No hemos podido conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";
const UNEXPECTED_MESSAGE =
  "El servidor ha respondido con un error inesperado. Inténtalo de nuevo en unos minutos.";

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", ...init });
  } catch {
    return { ok: false, status: 0, code: "NETWORK", message: NETWORK_MESSAGE };
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.ok && body !== null) {
    return { ok: true, data: body as T };
  }

  const envelope = body as (Partial<ApiErrorBody> & { day?: DayDto }) | null;
  const error = envelope?.error;
  if (error && typeof error.code === "string" && typeof error.message === "string") {
    return {
      ok: false,
      status: response.status,
      code: error.code,
      message: error.message,
      fieldErrors: error.fieldErrors,
      retryAfterSeconds: error.retryAfterSeconds,
      day: envelope?.day,
    };
  }
  return {
    ok: false,
    status: response.status,
    code: "PROVIDER_ERROR",
    message: UNEXPECTED_MESSAGE,
  };
}

const postJson = <T,>(url: string, payload: unknown) =>
  request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

/** Days requested from the availability endpoint; the server decides what is bookable. */
const AVAILABILITY_DAYS = 21;

export const getAvailability = () =>
  request<AvailabilityResponse>(`/api/booking/availability?days=${AVAILABILITY_DAYS}`);
export const postBooking = (payload: BookingRequest) =>
  postJson<BookingResponse>("/api/booking", payload);
export const postLead = (payload: LeadRequest) => postJson<LeadResponse>("/api/leads", payload);
export const postCancel = (token: string) =>
  postJson<CancelResponse>("/api/booking/cancel", { token });

/* The server rejects posts made less than 3 s or more than 2 h after the token was issued. */
const TOKEN_MIN_AGE_MS = 3_400;
const TOKEN_MAX_AGE_MS = 110 * 60 * 1000;

type IssuedToken = { token: string; at: number };

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Fetches a form token when the form is first shown and hands it out when
 * the visitor submits, waiting out the minimum age if they were very fast.
 */
export function useFormToken() {
  const issued = useRef<IssuedToken | null>(null);
  const pending = useRef<Promise<IssuedToken | null> | null>(null);

  const load = useCallback(() => {
    if (!pending.current) {
      pending.current = request<FormTokenResponse>("/api/form-token").then((result) => {
        pending.current = null;
        issued.current = result.ok ? { token: result.data.token, at: Date.now() } : null;
        return issued.current;
      });
    }
    return pending.current;
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const getToken = useCallback(async (): Promise<string | null> => {
    let current = issued.current;
    if (!current || Date.now() - current.at > TOKEN_MAX_AGE_MS) {
      current = await load();
    }
    if (!current) return null;
    const wait = TOKEN_MIN_AGE_MS - (Date.now() - current.at);
    if (wait > 0) await sleep(wait);
    return current.token;
  }, [load]);

  const invalidate = useCallback(() => {
    issued.current = null;
  }, []);

  return { getToken, invalidate };
}

export const TOKEN_FAILURE: ApiFailure = {
  ok: false,
  status: 0,
  code: "NETWORK",
  message: "No hemos podido preparar el formulario. Revisa tu conexión e inténtalo de nuevo.",
};

/** First message per field, in the shape the form components consume. */
export function firstFieldErrors(fieldErrors: ApiFieldErrors | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!fieldErrors) return out;
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages.length > 0) out[field] = messages[0];
  }
  return out;
}

import type { Interval } from "./slots";

/** What a provider needs to create the meeting. */
export type ReserveInput = {
  slot: Interval;
  /** Random hex value stored on the event; proves ownership on read-back and cancel. */
  nonce: string;
  ref: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  intent: string;
  visitorTimeZone: string;
  /** Link the visitor can use to cancel; shown in the invitation when present. */
  cancelUrl?: string;
};

export type ReserveResult =
  | { ok: true; meetUrl: string | null }
  | { ok: false; reason: "conflict" };

export type CancelResult = "cancelled" | "not_found";

/** Thrown for any upstream failure. Never carries visitor data. */
export class ProviderError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
  }
}

/**
 * Calendar + video seam. The server asks the provider for busy time and asks
 * it to reserve; `reserve` MUST be atomic per slot (two concurrent calls for
 * the same slot: exactly one gets `ok: true`).
 */
export interface CalendarProvider {
  readonly mode: "live" | "dev-memory";
  freeBusy(range: Interval): Promise<Interval[]>;
  reserve(input: ReserveInput): Promise<ReserveResult>;
  /** Cancels the booking on `slotStart` only if its stored nonce matches. */
  cancel(slotStart: number, nonce: string): Promise<CancelResult>;
}

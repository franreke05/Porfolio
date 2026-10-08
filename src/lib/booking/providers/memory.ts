import { parseCivilDate, wallToUtc } from "../time";
import type { CalendarProvider, CancelResult, ReserveInput, ReserveResult } from "../provider";
import type { Interval } from "../slots";

/**
 * LOCAL DEV ADAPTER — NOT A REAL CALENDAR.
 * Bookings live in process memory and vanish on restart. No event, invitation
 * or video room is created; the "meet" URL uses the reserved .invalid TLD.
 * The resolver refuses to hand this out in production.
 */
type Booking = { slot: Interval; nonce: string };

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Parses BOOKING_DEV_BUSY: comma-separated ISO instants (each blocks one slot
 * length from that instant) and/or civil dates YYYY-MM-DD (block that whole
 * day in `timeZone`). Unparseable entries are ignored.
 */
export function parseDevBusy(
  raw: string | undefined,
  slotMinutes: number,
  timeZone: string,
): Interval[] {
  if (!raw) return [];
  const intervals: Interval[] = [];
  for (const entry of raw.split(",").map((item) => item.trim()).filter(Boolean)) {
    const date = parseCivilDate(entry);
    if (date) {
      const start =
        wallToUtc(timeZone, date.year, date.month, date.day, 0, 0) ??
        Date.UTC(date.year, date.month - 1, date.day);
      intervals.push({ start, end: start + DAY_MS + 60 * 60 * 1000 });
      continue;
    }
    const start = Date.parse(entry);
    if (Number.isFinite(start)) {
      intervals.push({ start, end: start + slotMinutes * 60_000 });
    }
  }
  return intervals;
}

export class MemoryCalendarProvider implements CalendarProvider {
  readonly mode = "dev-memory" as const;
  private readonly bookings = new Map<number, Booking>();
  private readonly cancelled = new Set<string>();
  private readonly staticBusy: Interval[];

  constructor(staticBusy: Interval[] = []) {
    this.staticBusy = staticBusy;
  }

  private busyIntervals(): Interval[] {
    return [...this.staticBusy, ...[...this.bookings.values()].map((booking) => booking.slot)];
  }

  async freeBusy(range: Interval): Promise<Interval[]> {
    return this.busyIntervals().filter(
      (interval) => interval.start < range.end && interval.end > range.start,
    );
  }

  async reserve(input: ReserveInput): Promise<ReserveResult> {
    // Yield like a network call would, so concurrent callers really interleave.
    await Promise.resolve();
    // Check-and-set below is synchronous: atomic on the single JS thread.
    const taken = this.busyIntervals().some(
      (interval) => input.slot.start < interval.end && input.slot.end > interval.start,
    );
    if (taken) return { ok: false, reason: "conflict" };
    this.bookings.set(input.slot.start, { slot: input.slot, nonce: input.nonce });
    return { ok: true, meetUrl: `https://meet.invalid/dev-${input.ref.toLowerCase()}` };
  }

  async cancel(slotStart: number, nonce: string): Promise<CancelResult> {
    const key = `${slotStart}:${nonce}`;
    if (this.cancelled.has(key)) return "cancelled"; // idempotent repeat
    const booking = this.bookings.get(slotStart);
    if (!booking || booking.nonce !== nonce) return "not_found";
    this.bookings.delete(slotStart);
    this.cancelled.add(key);
    return "cancelled";
  }
}

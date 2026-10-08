import type { BookingConfig } from "./config";
import { addDays, civilDateIn, parseCivilDate, wallToUtc, weekdayOf } from "./time";

/** Half-open interval [start, end) in epoch milliseconds. */
export type Interval = { start: number; end: number };

export type DaySlots = { date: string; slots: Interval[] };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Every slot the config defines for a civil date, before any filtering. */
export function candidateSlotsForDate(config: BookingConfig, date: string): Interval[] {
  const parsed = parseCivilDate(date);
  if (!parsed) return [];
  if (!config.weekdays.includes(weekdayOf(date))) return [];

  const slots: Interval[] = [];
  const step = config.slotMinutes + config.bufferMinutes;
  for (
    let minutes = config.windowStartMinutes;
    minutes + config.slotMinutes <= config.windowEndMinutes;
    minutes += step
  ) {
    const start = wallToUtc(
      config.timeZone,
      parsed.year,
      parsed.month,
      parsed.day,
      Math.floor(minutes / 60),
      minutes % 60,
    );
    if (start === null) continue; // wall time skipped by a DST jump
    slots.push({ start, end: start + config.slotMinutes * MINUTE });
  }
  return slots;
}

function overlapsBusy(slot: Interval, busy: readonly Interval[], bufferMs: number): boolean {
  return busy.some(
    (interval) => slot.start < interval.end + bufferMs && slot.end > interval.start - bufferMs,
  );
}

function isBookable(
  config: BookingConfig,
  slot: Interval,
  busy: readonly Interval[],
  now: number,
): boolean {
  if (slot.start < now + config.minNoticeHours * HOUR) return false;
  return !overlapsBusy(slot, busy, config.bufferMinutes * MINUTE);
}

/** Last bookable civil date given the horizon. */
export function lastBookableDate(config: BookingConfig, now: number): string {
  return addDays(civilDateIn(now, config.timeZone), config.horizonDays);
}

/**
 * Free slots for `days` civil days starting at `from`.
 * Every business day inside the horizon is listed; a full day has `slots: []`.
 */
export function generateAvailability(
  config: BookingConfig,
  range: { from: string; days: number },
  busy: readonly Interval[],
  now: number,
): DaySlots[] {
  const today = civilDateIn(now, config.timeZone);
  const last = lastBookableDate(config, now);
  const result: DaySlots[] = [];

  for (let index = 0; index < range.days; index += 1) {
    const date = addDays(range.from, index);
    if (date < today || date > last) continue;
    if (!config.weekdays.includes(weekdayOf(date))) continue;
    result.push({
      date,
      slots: candidateSlotsForDate(config, date).filter((slot) =>
        isBookable(config, slot, busy, now),
      ),
    });
  }
  return result;
}

/**
 * Resolves a client-supplied start instant to a slot the config actually
 * defines (grid, weekday, notice and horizon). The client never decides times.
 */
export function findSlot(config: BookingConfig, start: number, now: number): Interval | null {
  if (!Number.isFinite(start)) return null;
  const date = civilDateIn(start, config.timeZone);
  if (date > lastBookableDate(config, now)) return null;
  const slot = candidateSlotsForDate(config, date).find((item) => item.start === start);
  if (!slot) return null;
  if (slot.start < now + config.minNoticeHours * HOUR) return null;
  return slot;
}

/** UTC range (with a day of margin each side) covering `days` civil days. */
export function queryWindow(range: { from: string; days: number }): Interval {
  const parsed = parseCivilDate(range.from);
  if (!parsed) throw new RangeError("Invalid civil date");
  const base = Date.UTC(parsed.year, parsed.month - 1, parsed.day);
  return { start: base - DAY, end: base + (range.days + 1) * DAY };
}

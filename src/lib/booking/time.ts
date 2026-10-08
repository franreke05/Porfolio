/**
 * Time-zone maths built only on Intl (no date library).
 * Civil dates are "YYYY-MM-DD" strings; instants are epoch milliseconds (UTC).
 */
export type WallParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

/** Wall-clock fields of an instant as seen in `timeZone`. */
export function zonedParts(ts: number, timeZone: string): WallParts {
  const out: Record<string, number> = {};
  for (const part of formatterFor(timeZone).formatToParts(new Date(ts))) {
    if (part.type !== "literal") out[part.type] = Number(part.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour,
    minute: out.minute,
    second: out.second,
  };
}

/** Offset (ms) to add to a UTC instant to get the wall clock in `timeZone`. */
export function tzOffsetMs(ts: number, timeZone: string): number {
  const p = zonedParts(ts, timeZone);
  const wallAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wallAsUtc - Math.floor(ts / 1000) * 1000;
}

/**
 * Converts a wall-clock time in `timeZone` to a UTC instant.
 * Returns null when that wall time does not exist (spring-forward gap).
 */
export function wallToUtc(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): number | null {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  let utc = guess - tzOffsetMs(guess, timeZone);
  utc = guess - tzOffsetMs(utc, timeZone); // second pass settles DST edges
  const p = zonedParts(utc, timeZone);
  const roundTrips =
    p.year === year &&
    p.month === month &&
    p.day === day &&
    p.hour === hour &&
    p.minute === minute;
  return roundTrips ? utc : null;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses "YYYY-MM-DD"; null when malformed or not a real calendar date. */
export function parseCivilDate(
  value: string,
): { year: number; month: number; day: number } | null {
  const match = DATE_RE.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}

export function formatCivilDate(year: number, month: number, day: number): string {
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}`;
}

/** Adds whole civil days to a "YYYY-MM-DD" date (no time zone involved). */
export function addDays(date: string, days: number): string {
  const parsed = parseCivilDate(date);
  if (!parsed) throw new RangeError("Invalid civil date");
  const next = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + days));
  return formatCivilDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

/** Weekday of a civil date, 0 = Sunday … 6 = Saturday. */
export function weekdayOf(date: string): number {
  const parsed = parseCivilDate(date);
  if (!parsed) throw new RangeError("Invalid civil date");
  return new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)).getUTCDay();
}

/** Civil date of an instant as seen in `timeZone`. */
export function civilDateIn(ts: number, timeZone: string): string {
  const p = zonedParts(ts, timeZone);
  return formatCivilDate(p.year, p.month, p.day);
}

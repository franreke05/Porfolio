/**
 * Display helpers only. Availability is never computed here: every instant
 * comes from the API and is merely formatted for a time zone.
 */
const LOCALE = "es-ES";
const cache = new Map<string, Intl.DateTimeFormat>();

function formatter(key: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const id = `${key}|${options.timeZone ?? ""}`;
  let found = cache.get(id);
  if (!found) {
    found = new Intl.DateTimeFormat(key === "civil" ? "en-CA" : LOCALE, options);
    cache.set(id, found);
  }
  return found;
}

export function visitorTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Madrid";
  } catch {
    return "Europe/Madrid";
  }
}

/** "11:00" */
export const timeIn = (iso: string, timeZone: string) =>
  formatter("time", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(
    new Date(iso),
  );

/** "jue 15" */
export function dayShortIn(iso: string, timeZone: string): string {
  const parts = formatter("short", { weekday: "short", day: "numeric", timeZone }).formatToParts(
    new Date(iso),
  );
  const weekday = parts.find((part) => part.type === "weekday")?.value.replace(".", "") ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${weekday} ${day}`;
}

/** "jueves, 15 de octubre de 2026" */
export const dateLongIn = (iso: string, timeZone: string) =>
  formatter("long", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(new Date(iso));

/** Civil date (YYYY-MM-DD) of an instant in a zone. */
export const civilDateIn = (iso: string, timeZone: string) =>
  formatter("civil", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).format(
    new Date(iso),
  );

/* ── Civil dates (YYYY-MM-DD), handled in UTC so no local offset can shift them ── */

export function parseCivil(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export const formatCivil = (date: Date) => date.toISOString().slice(0, 10);

export const addDays = (date: string, amount: number) =>
  formatCivil(new Date(parseCivil(date).getTime() + amount * 86_400_000));

export const monthOf = (date: string) => date.slice(0, 7);

export const civilLong = (date: string) => dateLongIn(parseCivil(date).toISOString(), "UTC");

export function monthLabel(month: string): string {
  const label = formatter("month", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    parseCivil(`${month}-01`),
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Monday-to-Friday rows of a month; `null` pads days that belong to another month. */
export function businessWeeks(month: string): (string | null)[][] {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const rows = new Map<string, (string | null)[]>();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, monthNumber - 1, day));
    const weekday = date.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const monday = formatCivil(new Date(date.getTime() - (weekday - 1) * 86_400_000));
    const row = rows.get(monday) ?? [null, null, null, null, null];
    row[weekday - 1] = formatCivil(date);
    rows.set(monday, row);
  }
  return [...rows.values()];
}

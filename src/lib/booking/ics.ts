import { escapeIcsText } from "../security/sanitize";

export type IcsEvent = {
  uid: string;
  /** Epoch ms (UTC). */
  start: number;
  end: number;
  /** When the document is generated, epoch ms. */
  stamp: number;
  summary: string;
  description?: string;
  /** Meeting URL (shown as location and URL). */
  url?: string | null;
};

function icsDate(ts: number): string {
  return new Date(ts).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

/** RFC 5545 line folding: max 75 octets per line, continuation starts with a space. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let currentBytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    const limit = out.length === 0 ? 75 : 74;
    if (currentBytes + size > limit) {
      out.push(current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

/** Builds a single-event iCalendar document with UTC times (DST-proof). */
export function buildIcs(event: IcsEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ORYKAI SOFTWARE//Portfolio Booking//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(event.uid)}`,
    `DTSTAMP:${icsDate(event.stamp)}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(event.end)}`,
    `SUMMARY:${escapeIcsText(event.summary)}`,
  ];
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  if (event.url) {
    lines.push(`LOCATION:${escapeIcsText(event.url)}`);
    lines.push(`URL:${event.url.replace(/[\r\n]/g, "")}`);
  }
  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");
  return `${lines.map(fold).join("\r\n")}\r\n`;
}

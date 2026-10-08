/** Input sanitisation and output escaping helpers. Pure functions. */

// Control chars except \n and \t, plus zero-width and bidi override characters.
const UNSAFE_CHARS =
  /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u2069\uFEFF]/g;

/** Single-line value: no control chars, no line breaks, collapsed spaces. */
export function sanitizeLine(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(UNSAFE_CHARS, "")
    .replace(/ {2,}/g, " ")
    .trim();
}

/** Multi-line value: keeps \n, drops other control chars, caps blank runs. */
export function sanitizeText(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, " ")
    .replace(UNSAFE_CHARS, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** RFC 5545 TEXT escaping. */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n?|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

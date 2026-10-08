import type { Lead } from "../leads/model";
import { escapeHtml, sanitizeLine } from "../security/sanitize";

export type EmailContent = { subject: string; text: string; html: string };

const CHANNEL_LABEL: Record<Lead["channel"], string> = {
  EMAIL: "Mensaje escrito",
  PHONE: "Llamada telefónica",
  VIDEO_MEETING: "Reunión",
};

const PREFERRED_TIME_LABEL = {
  MORNING: "Por la mañana",
  AFTERNOON: "Por la tarde",
  SPECIFIC: "Franja concreta",
} as const;

export function formatInZone(iso: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      timeZone,
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function rowsFor(lead: Lead, businessTimeZone: string): [string, string][] {
  const rows: [string, string][] = [
    ["Canal", CHANNEL_LABEL[lead.channel]],
    ["Referencia", lead.ref],
    ["Nombre", lead.name],
  ];
  if (lead.channel === "EMAIL") {
    rows.push(["Email", lead.email]);
    if (lead.projectType) rows.push(["Tipo de proyecto", lead.projectType]);
  } else if (lead.channel === "PHONE") {
    rows.push(["Teléfono", lead.phone]);
    const note = lead.preferredTimeNote ? ` — ${lead.preferredTimeNote}` : "";
    rows.push(["Preferencia", `${PREFERRED_TIME_LABEL[lead.preferredTime]}${note}`]);
  } else {
    rows.push(["Email", lead.email]);
    if (lead.phone) rows.push(["Teléfono", lead.phone]);
    rows.push([
      "Cuándo",
      `${formatInZone(lead.start, businessTimeZone)} (${businessTimeZone})`,
    ]);
    rows.push(["Zona del visitante", lead.visitorTimeZone]);
    rows.push(["Enlace", lead.meetUrl ?? "Pendiente (llega en la invitación del calendario)"]);
  }
  rows.push(["Motivo", lead.intent]);
  rows.push(["Consentimiento", `${lead.consent.at} · aviso ${lead.consent.policyVersion}`]);
  return rows;
}

function render(title: string, rows: [string, string][], message?: string): EmailContent["html"] {
  const body = rows
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 6px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
    )
    .join("");
  const note = message
    ? `<hr style="border:0;border-top:1px solid #E8D7BD;margin:20px 0;" /><p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>`
    : "";
  return `<div style="font-family:Arial,sans-serif;color:#121820;line-height:1.6;"><h1 style="margin:0 0 16px;font-size:20px;">${escapeHtml(title)}</h1>${body}${note}</div>`;
}

/** Notification sent to the site owner for any lead. */
export function ownerLeadEmail(lead: Lead, businessTimeZone: string): EmailContent {
  const rows = rowsFor(lead, businessTimeZone);
  const title = `Nuevo contacto: ${CHANNEL_LABEL[lead.channel]}`;
  const text = [...rows.map(([label, value]) => `${label}: ${value}`), "", lead.message ?? ""]
    .join("\n")
    .trimEnd();
  return {
    // sanitizeLine strips CR/LF so user input can never break out of the subject.
    subject: sanitizeLine(`[Portfolio] ${CHANNEL_LABEL[lead.channel]} · ${lead.name}`).slice(0, 150),
    text,
    html: render(title, rows, lead.message),
  };
}

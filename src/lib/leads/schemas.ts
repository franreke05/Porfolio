import { z } from "zod";
import { sanitizeLine, sanitizeText } from "../security/sanitize";
import { DEFAULT_INTENT, INTENTS, PREFERRED_TIMES } from "./model";

/** Server-side validation for every public payload. Unknown keys are rejected. */
const line = (min: number, max: number, tooShort: string, tooLong: string) =>
  z
    .string({ error: tooShort })
    .max(max * 4, tooLong)
    .transform(sanitizeLine)
    .pipe(z.string().min(min, tooShort).max(max, tooLong));

const optionalText = (max: number, tooLong: string) =>
  z
    .string()
    .max(max * 4, tooLong)
    .transform(sanitizeText)
    .pipe(z.string().max(max, tooLong))
    .optional()
    .transform((value) => (value ? value : undefined));

const name = line(2, 80, "Indica tu nombre.", "El nombre es demasiado largo.");

const email = z
  .string({ error: "Indica un email válido." })
  .max(240, "El email es demasiado largo.")
  .transform((value) => sanitizeLine(value).toLowerCase())
  .pipe(z.email("Indica un email válido.").max(120, "El email es demasiado largo."));

const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const phone = z
  .string({ error: "Indica un teléfono válido." })
  .max(80, "Indica un teléfono válido.")
  .transform(sanitizeLine)
  .pipe(z.string().regex(PHONE_RE, "Indica un teléfono válido."));

const optionalPhone = z
  .string()
  .max(80, "Indica un teléfono válido.")
  .transform(sanitizeLine)
  .pipe(z.union([z.literal(""), z.string().regex(PHONE_RE, "Indica un teléfono válido.")]))
  .optional()
  .transform((value) => (value ? value : undefined));

const intent = z.enum(INTENTS, "Motivo no válido.").default(DEFAULT_INTENT);

const consent = z.literal(true, "Debes aceptar el aviso de privacidad.");

const formToken = z.string({ error: "Recarga la página e inténtalo de nuevo." }).min(1).max(200);

/** Honeypot: accepted by the schema, judged separately (a filled value is a bot). */
const website = z.string().max(500).optional();

const isoInstant = z
  .string({ error: "Selecciona una hora." })
  .max(40)
  .refine((value) => {
    const ts = Date.parse(value);
    return Number.isFinite(ts) && new Date(ts).toISOString() === value;
  }, "Selecciona una hora válida.");

const timeZone = z
  .string({ error: "Zona horaria no válida." })
  .regex(/^[A-Za-z0-9_+\-/]{1,64}$/, "Zona horaria no válida.");

export const bookingRequestSchema = z.strictObject({
  start: isoInstant,
  name,
  email,
  phone: optionalPhone,
  message: optionalText(1000, "El mensaje es demasiado largo."),
  intent,
  visitorTimeZone: timeZone,
  consent,
  formToken,
  website,
});
export type BookingInput = z.output<typeof bookingRequestSchema>;

const phoneLeadSchema = z.strictObject({
  channel: z.literal("PHONE"),
  name,
  phone,
  preferredTime: z.enum(PREFERRED_TIMES, "Indica cuándo prefieres la llamada."),
  preferredTimeNote: optionalText(80, "La franja indicada es demasiado larga."),
  message: optionalText(1000, "El mensaje es demasiado largo."),
  intent,
  consent,
  formToken,
  website,
});

const emailLeadSchema = z.strictObject({
  channel: z.literal("EMAIL"),
  name,
  email,
  projectType: optionalText(80, "El tipo de proyecto es demasiado largo."),
  message: z
    .string({ error: "Cuéntame un poco más sobre el proyecto." })
    .max(8000, "El mensaje es demasiado largo.")
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(10, "Cuéntame un poco más sobre el proyecto.")
        .max(2000, "El mensaje es demasiado largo."),
    ),
  intent,
  consent,
  formToken,
  website,
});

export const leadRequestSchema = z.discriminatedUnion(
  "channel",
  [phoneLeadSchema, emailLeadSchema],
  "Canal de contacto no válido.",
);
export type LeadInput = z.output<typeof leadRequestSchema>;

export const cancelRequestSchema = z.strictObject({
  token: z.string().min(1).max(512),
});

const CIVIL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const availabilityQuerySchema = z.object({
  from: z.string().regex(CIVIL_DATE_RE, "Fecha no válida.").optional(),
  days: z.coerce.number().int().min(1).max(31).optional(),
});

/** Field errors in the wire format (`{ field: [messages] }`). */
export function fieldErrorsOf(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_";
    const message = issue.code === "unrecognized_keys" ? "Campo no admitido." : issue.message;
    (out[key] ??= []).push(message);
  }
  return out;
}

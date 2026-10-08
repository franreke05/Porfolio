import { INTENTS, type Intent } from "@/lib/leads/model";

export const INTENT_LABEL: Record<Intent, string> = {
  "mobile-app": "App móvil",
  "custom-software": "Software a medida",
  web: "Web",
  requenadesk: "RequenaDesk",
  "existing-project": "Proyecto ya empezado",
  general: "Consulta general",
};

/** Options of the "tipo de proyecto" select: every intent except the catch-all. */
export const INTENT_OPTIONS: Intent[] = INTENTS.filter((intent) => intent !== "general");

export function parseIntent(value: string | string[] | undefined): Intent {
  const candidate = Array.isArray(value) ? value[0] : value;
  return (INTENTS as readonly string[]).includes(candidate ?? "") ? (candidate as Intent) : "general";
}

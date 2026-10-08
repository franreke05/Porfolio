import { randomBytes } from "node:crypto";
import { bookingConfig } from "@/lib/booking/config";
import type { LeadResponse } from "@/lib/booking/contract";
import {
  apiError,
  guardPost,
  honeypotTripped,
  json,
  logEvent,
  rateLimit,
} from "@/lib/http/respond";
import { PRIVACY_POLICY_VERSION } from "@/lib/leads/model";
import type { Lead } from "@/lib/leads/model";
import { fieldErrorsOf, leadRequestSchema } from "@/lib/leads/schemas";
import { submitLead } from "@/lib/leads/sink";
import { getLeadSinks } from "@/lib/leads/sinks/email";
import { verifyFormToken } from "@/lib/security/form-token";
import { getSigningSecret } from "@/lib/security/secret";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "leads";

export async function POST(request: Request): Promise<Response> {
  const guarded = await guardPost(request, {
    bucket: "leads-attempt",
    limit: 10,
    windowMs: 10 * 60_000,
  });
  if (!guarded.ok) return guarded.response;

  if (honeypotTripped(guarded.body)) return apiError("REJECTED");

  const parsed = leadRequestSchema.safeParse(guarded.body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", { fieldErrors: fieldErrorsOf(parsed.error) });
  }
  const input = parsed.data;

  const secret = getSigningSecret();
  const sinks = getLeadSinks(bookingConfig.timeZone);
  // Without a real destination the lead would be lost: say so instead of faking success.
  if (!secret || sinks.length === 0) return apiError("PROVIDER_NOT_CONFIGURED");

  if (verifyFormToken(input.formToken, secret) !== "ok") return apiError("REJECTED");

  const limited = rateLimit(request, { bucket: "leads-create", limit: 5, windowMs: 60 * 60_000 });
  if (limited) return limited;

  const createdAt = new Date().toISOString();
  const base = {
    name: input.name,
    intent: input.intent,
    consent: { at: createdAt, policyVersion: PRIVACY_POLICY_VERSION },
    createdAt,
  };
  const lead: Lead =
    input.channel === "PHONE"
      ? {
          ...base,
          channel: "PHONE",
          ref: `T-${randomBytes(5).toString("hex").toUpperCase()}`,
          phone: input.phone,
          preferredTime: input.preferredTime,
          preferredTimeNote:
            input.preferredTime === "SPECIFIC" ? input.preferredTimeNote : undefined,
          message: input.message,
        }
      : {
          ...base,
          channel: "EMAIL",
          ref: `M-${randomBytes(5).toString("hex").toUpperCase()}`,
          email: input.email,
          projectType: input.projectType,
          message: input.message,
        };

  const report = await submitLead(lead, sinks);
  if (report.delivered.length === 0) {
    logEvent({ route: ROUTE, code: "PROVIDER_ERROR", channel: lead.channel, ref: lead.ref });
    return apiError("PROVIDER_ERROR");
  }

  const body: LeadResponse = { status: "received", ref: lead.ref };
  return json(body, 201);
}

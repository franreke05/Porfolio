import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { ownerLeadEmail } from "../../email/templates";
import type { Lead } from "../model";
import type { LeadSink } from "../sink";

type Env = Record<string, string | undefined>;

/** Sends the owner notification through Resend. */
class ResendLeadSink implements LeadSink {
  readonly name = "email";
  private readonly client: Resend;
  private readonly from: string;
  private readonly to: string;
  private readonly businessTimeZone: string;

  constructor(apiKey: string, from: string, to: string, businessTimeZone: string) {
    this.client = new Resend(apiKey);
    this.from = from;
    this.to = to;
    this.businessTimeZone = businessTimeZone;
  }

  async deliver(lead: Lead): Promise<void> {
    const content = ownerLeadEmail(lead, this.businessTimeZone);
    const result = await this.client.emails.send({
      from: this.from,
      to: this.to,
      replyTo: "email" in lead ? lead.email : undefined,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
    if (result.error) throw new Error("resend rejected the message");
  }
}

/**
 * LOCAL DEV ADAPTER — sends nothing. Writes the would-be email to
 * `.dev-outbox/` (gitignored) so the flow is testable without credentials.
 */
class DevOutboxLeadSink implements LeadSink {
  readonly name = "dev-outbox";
  private readonly businessTimeZone: string;

  constructor(businessTimeZone: string) {
    this.businessTimeZone = businessTimeZone;
  }

  async deliver(lead: Lead): Promise<void> {
    const dir = path.join(process.cwd(), ".dev-outbox");
    await mkdir(dir, { recursive: true });
    const content = ownerLeadEmail(lead, this.businessTimeZone);
    const file = path.join(dir, `${Date.now()}-${lead.ref}.json`);
    await writeFile(file, JSON.stringify({ lead, email: content }, null, 2), "utf8");
  }
}

/**
 * Sinks allowed in this environment.
 * - Resend when fully configured.
 * - Dev outbox only on a local, non-production machine (never on Vercel).
 * - Otherwise none: the API must answer 503, never a fake success.
 */
export function getLeadSinks(businessTimeZone: string, env: Env = process.env): LeadSink[] {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
  if (RESEND_API_KEY && CONTACT_TO_EMAIL && CONTACT_FROM_EMAIL) {
    return [
      new ResendLeadSink(RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, businessTimeZone),
    ];
  }
  const isLocalDev = env.NODE_ENV !== "production" && !env.VERCEL;
  return isLocalDev ? [new DevOutboxLeadSink(businessTimeZone)] : [];
}

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ownerLeadEmail } from "../email/templates";
import type { Lead } from "./model";
import { bookingRequestSchema, fieldErrorsOf, leadRequestSchema } from "./schemas";
import { submitLead } from "./sink";
import type { LeadSink } from "./sink";

const booking = {
  start: "2026-10-08T09:00:00.000Z",
  name: "Ada Lovelace",
  email: "Ada@Example.com",
  visitorTimeZone: "America/Bogota",
  consent: true,
  formToken: "t",
};

describe("booking schema", () => {
  it("normalises a valid request and defaults the intent", () => {
    const parsed = bookingRequestSchema.parse({ ...booking, phone: "", website: "" });
    assert.equal(parsed.email, "ada@example.com");
    assert.equal(parsed.intent, "general");
    assert.equal(parsed.phone, undefined);
    assert.equal(parsed.message, undefined);
  });

  it("requires consent, a canonical instant and known keys", () => {
    for (const patch of [
      { consent: false },
      { start: "2026-10-08 11:00" },
      { start: "2026-10-08T11:00:00+02:00" },
      { intent: "something-else" },
      { visitorTimeZone: "Europe/Madrid\r\nX: 1" },
      { email: "not-an-email" },
      { role: "admin" },
    ]) {
      assert.equal(bookingRequestSchema.safeParse({ ...booking, ...patch }).success, false);
    }
  });

  it("reports errors per field", () => {
    const result = bookingRequestSchema.safeParse({ ...booking, name: " ", email: "x" });
    assert.equal(result.success, false);
    const errors = fieldErrorsOf(result.error!);
    assert.deepEqual(Object.keys(errors).sort(), ["email", "name"]);
  });

  it("strips header-injection attempts from the name", () => {
    const parsed = bookingRequestSchema.parse({ ...booking, name: "Ada\r\nBcc: a@b.c" });
    assert.equal(parsed.name, "Ada Bcc: a@b.c");
  });
});

describe("lead schema", () => {
  const phone = {
    channel: "PHONE",
    name: "Ada",
    phone: "+34 600 000 000",
    preferredTime: "SPECIFIC",
    preferredTimeNote: "De 16 a 18 h",
    consent: true,
    formToken: "t",
  };
  const email = {
    channel: "EMAIL",
    name: "Ada",
    email: "ada@example.com",
    message: "Necesito una app para mi negocio.",
    intent: "mobile-app",
    consent: true,
    formToken: "t",
  };

  it("accepts both channels", () => {
    assert.equal(leadRequestSchema.parse(phone).channel, "PHONE");
    const parsed = leadRequestSchema.parse(email);
    assert.equal(parsed.channel, "EMAIL");
    assert.equal(parsed.intent, "mobile-app");
  });

  it("rejects bad phones, unknown times, long notes, short messages and other channels", () => {
    for (const payload of [
      { ...phone, phone: "call me" },
      { ...phone, preferredTime: "EVENING" },
      { ...phone, preferredTimeNote: "x".repeat(81) },
      { ...phone, email: "ada@example.com" },
      { ...email, message: "hola" },
      { ...email, channel: "VIDEO_MEETING" },
    ]) {
      assert.equal(leadRequestSchema.safeParse(payload).success, false);
    }
  });
});

describe("lead delivery", () => {
  const lead: Lead = {
    channel: "EMAIL",
    ref: "M-1",
    name: "Ada <b>",
    email: "ada@example.com",
    message: "Hola\n<script>alert(1)</script>",
    intent: "web",
    consent: { at: "2026-10-07T08:00:00.000Z", policyVersion: "2026-10" },
    createdAt: "2026-10-07T08:00:00.000Z",
  };

  it("reports which sinks delivered and which failed", async () => {
    const ok: LeadSink = { name: "ok", deliver: async () => {} };
    const bad: LeadSink = {
      name: "bad",
      deliver: async () => {
        throw new Error("down");
      },
    };
    assert.deepEqual(await submitLead(lead, [ok, bad]), { delivered: ["ok"], failed: ["bad"] });
    assert.deepEqual(await submitLead(lead, []), { delivered: [], failed: [] });
  });

  it("escapes user input in the owner email", () => {
    const content = ownerLeadEmail(lead, "Europe/Madrid");
    assert.equal(content.html.includes("<script>"), false);
    assert.ok(content.html.includes("&lt;script&gt;"));
    assert.equal(/[\r\n]/.test(content.subject), false);
    assert.ok(content.text.includes("Referencia: M-1"));
  });
});

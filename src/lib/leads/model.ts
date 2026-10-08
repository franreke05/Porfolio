/**
 * One LEAD concept for the three contact channels.
 * Dependency-free on purpose: safe to import from client components.
 */
export const INTENTS = [
  "mobile-app",
  "custom-software",
  "web",
  "requenadesk",
  "existing-project",
  "general",
] as const;
export type Intent = (typeof INTENTS)[number];
/** Alias kept for callers that name it by its role in the contact flow. */
export type ContactIntent = Intent;
export const DEFAULT_INTENT: Intent = "general";

export const LEAD_CHANNELS = ["EMAIL", "PHONE", "VIDEO_MEETING"] as const;
export type LeadChannel = (typeof LEAD_CHANNELS)[number];

export const PREFERRED_TIMES = ["MORNING", "AFTERNOON", "SPECIFIC"] as const;
export type PreferredTime = (typeof PREFERRED_TIMES)[number];

/** Version of the privacy notice the visitor accepted. Bump when the text changes. */
export const PRIVACY_POLICY_VERSION = "2026-10";

export type LeadConsent = { at: string; policyVersion: string };

type LeadBase = {
  /** Random public reference, never a lookup key. */
  ref: string;
  name: string;
  intent: Intent;
  consent: LeadConsent;
  /** UTC ISO instant. */
  createdAt: string;
};

export type EmailLead = LeadBase & {
  channel: "EMAIL";
  email: string;
  projectType?: string;
  message: string;
};

export type PhoneLead = LeadBase & {
  channel: "PHONE";
  phone: string;
  preferredTime: PreferredTime;
  preferredTimeNote?: string;
  message?: string;
};

export type VideoMeetingLead = LeadBase & {
  channel: "VIDEO_MEETING";
  email: string;
  phone?: string;
  message?: string;
  /** UTC ISO instants. */
  start: string;
  end: string;
  visitorTimeZone: string;
  meetUrl: string | null;
};

export type Lead = EmailLead | PhoneLead | VideoMeetingLead;

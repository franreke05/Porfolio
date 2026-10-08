import type { Lead } from "./model";

/**
 * Where a lead goes after it is accepted. Today: an email to the owner.
 * A RequenaDesk sink plugs in here once that system exposes an intake API
 * (there is deliberately no stub or fake integration for it).
 */
export interface LeadSink {
  readonly name: string;
  deliver(lead: Lead): Promise<void>;
}

export type DeliveryReport = { delivered: string[]; failed: string[] };

/** Delivers to every sink independently; one failing sink does not stop the others. */
export async function submitLead(lead: Lead, sinks: readonly LeadSink[]): Promise<DeliveryReport> {
  const results = await Promise.allSettled(sinks.map((sink) => sink.deliver(lead)));
  const report: DeliveryReport = { delivered: [], failed: [] };
  results.forEach((result, index) => {
    (result.status === "fulfilled" ? report.delivered : report.failed).push(sinks[index].name);
  });
  return report;
}

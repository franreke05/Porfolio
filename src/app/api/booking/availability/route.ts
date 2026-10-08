import { bookingConfig } from "@/lib/booking/config";
import type { AvailabilityResponse } from "@/lib/booking/contract";
import { ProviderError } from "@/lib/booking/provider";
import { getCalendarProvider } from "@/lib/booking/providers";
import { generateAvailability, queryWindow } from "@/lib/booking/slots";
import { civilDateIn, parseCivilDate } from "@/lib/booking/time";
import { apiError, json, logEvent, rateLimit } from "@/lib/http/respond";
import { availabilityQuerySchema, fieldErrorsOf } from "@/lib/leads/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "booking/availability";

export async function GET(request: Request): Promise<Response> {
  const limited = rateLimit(request, { bucket: "availability", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const url = new URL(request.url);
  const parsed = availabilityQuerySchema.safeParse({
    from: url.searchParams.get("from") ?? undefined,
    days: url.searchParams.get("days") ?? undefined,
  });
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", { fieldErrors: fieldErrorsOf(parsed.error) });
  }

  const now = Date.now();
  const today = civilDateIn(now, bookingConfig.timeZone);
  const from = parsed.data.from ?? today;
  if (!parseCivilDate(from)) {
    return apiError("VALIDATION_ERROR", { fieldErrors: { from: ["Fecha no válida."] } });
  }
  const days = Math.min(parsed.data.days ?? 14, bookingConfig.maxDaysPerQuery);

  const provider = getCalendarProvider();
  if (!provider) return apiError("PROVIDER_NOT_CONFIGURED");

  try {
    const range = { from, days };
    const busy = await provider.freeBusy(queryWindow(range));
    const body: AvailabilityResponse = {
      mode: provider.mode,
      timezone: bookingConfig.timeZone,
      slotMinutes: bookingConfig.slotMinutes,
      generatedAt: new Date(now).toISOString(),
      days: generateAvailability(bookingConfig, range, busy, now).map((day) => ({
        date: day.date,
        slots: day.slots.map((slot) => ({
          start: new Date(slot.start).toISOString(),
          end: new Date(slot.end).toISOString(),
        })),
      })),
    };
    return json(body);
  } catch (error) {
    logEvent({
      route: ROUTE,
      code: "PROVIDER_ERROR",
      providerStatus: error instanceof ProviderError ? error.status : undefined,
    });
    return apiError("PROVIDER_ERROR");
  }
}

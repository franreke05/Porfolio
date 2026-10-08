import { verifyCancelToken } from "@/lib/booking/cancel-token";
import type { CancelResponse } from "@/lib/booking/contract";
import { ProviderError } from "@/lib/booking/provider";
import { getCalendarProvider } from "@/lib/booking/providers";
import { apiError, guardPost, json, logEvent } from "@/lib/http/respond";
import { cancelRequestSchema } from "@/lib/leads/schemas";
import { getSigningSecret } from "@/lib/security/secret";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const guarded = await guardPost(request, {
    bucket: "booking-cancel",
    limit: 10,
    windowMs: 60 * 60_000,
  });
  if (!guarded.ok) return guarded.response;

  const secret = getSigningSecret();
  const provider = getCalendarProvider();
  if (!secret || !provider) return apiError("PROVIDER_NOT_CONFIGURED");

  // One indistinguishable answer for malformed, forged, expired or unknown tokens.
  const parsed = cancelRequestSchema.safeParse(guarded.body);
  if (!parsed.success) return apiError("INVALID_TOKEN");
  const claims = verifyCancelToken(parsed.data.token, secret);
  if (!claims) return apiError("INVALID_TOKEN");

  try {
    const result = await provider.cancel(claims.start, claims.nonce);
    if (result !== "cancelled") return apiError("INVALID_TOKEN");
    const body: CancelResponse = { status: "cancelled" };
    return json(body);
  } catch (error) {
    logEvent({
      route: "booking/cancel",
      code: "PROVIDER_ERROR",
      providerStatus: error instanceof ProviderError ? error.status : undefined,
    });
    return apiError("PROVIDER_ERROR");
  }
}

import type { FormTokenResponse } from "@/lib/booking/contract";
import { apiError, json, rateLimit } from "@/lib/http/respond";
import { issueFormToken } from "@/lib/security/form-token";
import { getSigningSecret } from "@/lib/security/secret";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const limited = rateLimit(request, { bucket: "form-token", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const secret = getSigningSecret();
  if (!secret) return apiError("PROVIDER_NOT_CONFIGURED");

  const body: FormTokenResponse = { token: issueFormToken(secret) };
  return json(body);
}

import { z } from "zod";
import { fail, preflight } from "@/lib/server/forms";
import { trackShipment } from "@/lib/tracking";
import { trackingIdSchema } from "@/lib/validation/forms";

/**
 * GET /api/tracking?tracking_id=… → TrackingResult, looked up server-side with IMD (lib/tracking.ts). `not_connected`
 * while IMD isn't configured; 502 with `unavailable` when IMD can't be reached or answers with an error.
 */
export async function GET(req: Request) {
  const blocked = preflight(req, "tracking", 0);
  if (blocked) return blocked;

  const parsed = trackingIdSchema.safeParse(new URL(req.url).searchParams.get("tracking_id") ?? "");
  if (!parsed.success) {
    return fail("VALIDATION", 422, { fieldErrors: { tracking_id: z.flattenError(parsed.error).formErrors } });
  }
  const result = await trackShipment(parsed.data);
  return Response.json(result, { status: result.status === "unavailable" ? 502 : 200, headers: { "Cache-Control": "no-store" } });
}

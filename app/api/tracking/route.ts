import { z } from "zod";
import { fail, preflight } from "@/lib/server/forms";
import { trackShipment } from "@/lib/tracking";
import { trackingIdSchema } from "@/lib/validation/forms";

/** GET /api/tracking?tracking_id=… → TrackingResult. Returns `not_connected` until a provider is configured. */
export async function GET(req: Request) {
  const blocked = preflight(req, "tracking", 0);
  if (blocked) return blocked;

  const parsed = trackingIdSchema.safeParse(new URL(req.url).searchParams.get("tracking_id") ?? "");
  if (!parsed.success) {
    return fail("VALIDATION", 422, { fieldErrors: { tracking_id: z.flattenError(parsed.error).formErrors } });
  }
  return Response.json(await trackShipment(parsed.data), { headers: { "Cache-Control": "no-store" } });
}

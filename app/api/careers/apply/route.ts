import { z } from "zod";
import { JOBS } from "@/lib/content/careers";
import { deliver, fail, preflight } from "@/lib/server/forms";
import { applicationSchema, CV_MAX_BYTES, cvError, HONEYPOT_FIELD } from "@/lib/validation/forms";

/** CV limit plus headroom for the text fields and multipart boundaries. */
const MAX_BYTES = CV_MAX_BYTES + 64 * 1024;

export async function POST(req: Request) {
  const blocked = preflight(req, "apply", MAX_BYTES);
  if (blocked) return blocked;
  if (!req.headers.get("content-type")?.includes("multipart/form-data")) return fail("BAD_REQUEST", 415);

  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return fail("BAD_REQUEST", 400);
  }
  if (data.get(HONEYPOT_FIELD)) return fail("BAD_REQUEST", 400);

  const parsed = applicationSchema.safeParse(Object.fromEntries(
    ["position", "applicant_name", "email", "phone"].map((k) => [k, data.get(k) ?? undefined]),
  ));
  const entry = data.get("cv");
  // FormData values are string | File; anything not a string is the uploaded file.
  const cv = entry && typeof entry !== "string" ? entry : null;
  const fileError = cvError(cv);
  const positionError = parsed.success && !JOBS.some((j) => j.title === parsed.data.position);

  if (!parsed.success || fileError || positionError) {
    const fieldErrors: Record<string, string[]> = parsed.success
      ? {}
      : (z.flattenError(parsed.error).fieldErrors as Record<string, string[]>);
    if (fileError) fieldErrors.cv = [fileError];
    if (positionError) fieldErrors.position = ["This position is not open."];
    return fail("VALIDATION", 422, { fieldErrors });
  }

  const file = cv as File; // non-null: fileError would be set otherwise
  return deliver({
    form: "apply",
    fields: parsed.data,
    attachments: [{ filename: file.name, content: await file.arrayBuffer(), contentType: file.type || "application/octet-stream" }],
  });
}

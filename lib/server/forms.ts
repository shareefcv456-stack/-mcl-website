import { z } from "zod";
import type { FormErrorCode, FormResponse } from "@/lib/forms/response";
import { HONEYPOT_FIELD } from "@/lib/validation/forms";
import { getMailProvider, type OutboundMessage } from "./mail";
import { clientIp, createRateLimiter } from "./rate-limit";

/** 5 submissions per minute per IP, counted separately for each form. */
const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

const MESSAGES: Record<FormErrorCode, string> = {
  VALIDATION: "Please fix the highlighted fields.",
  BAD_REQUEST: "We couldn't read that submission. Please try again.",
  PAYLOAD_TOO_LARGE: "That submission is too large.",
  RATE_LIMITED: "Too many submissions. Please wait a minute and try again.",
  DELIVERY_NOT_CONFIGURED: "Online delivery isn't set up yet, so nothing was sent.",
  DELIVERY_FAILED: "We couldn't send your message right now. Please try again or contact us directly.",
};

export function fail(code: FormErrorCode, status: number, extra?: { fieldErrors?: Record<string, string[]>; headers?: HeadersInit }) {
  const body: FormResponse = { ok: false, code, message: MESSAGES[code], fieldErrors: extra?.fieldErrors };
  return Response.json(body, { status, headers: extra?.headers });
}

/** Rate limit + declared-size check shared by every public form endpoint. Returns a response to short-circuit with, or null. */
export function preflight(req: Request, form: string, maxBytes: number): Response | null {
  const retryAfter = limiter.check(`${form}:${clientIp(req)}`);
  if (retryAfter) return fail("RATE_LIMITED", 429, { headers: { "Retry-After": String(retryAfter) } });
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) return fail("PAYLOAD_TOO_LARGE", 413);
  return null;
}

export function validationFailure(error: z.ZodError) {
  return fail("VALIDATION", 422, { fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]> });
}

/** Hands a validated message to the mail provider. Never reports success unless the provider accepted it. */
export async function deliver(message: OutboundMessage): Promise<Response> {
  const mailer = getMailProvider();
  if (!mailer) return fail("DELIVERY_NOT_CONFIGURED", 503);
  try {
    await mailer.send(message);
    return Response.json({ ok: true } satisfies FormResponse);
  } catch (err) {
    // Log the reason only — never the visitor's data.
    console.error(`[forms] ${message.form} delivery failed:`, err instanceof Error ? err.message : "unknown error");
    return fail("DELIVERY_FAILED", 502);
  }
}

/** Full pipeline for JSON form endpoints: rate limit → size → parse → honeypot → validate → deliver. */
export async function handleJsonForm(
  req: Request,
  form: string,
  schema: z.ZodType<Record<string, string>>,
  maxBytes = 16 * 1024,
): Promise<Response> {
  const blocked = preflight(req, form, maxBytes);
  if (blocked) return blocked;
  if (!req.headers.get("content-type")?.includes("application/json")) return fail("BAD_REQUEST", 415);

  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > maxBytes) return fail("PAYLOAD_TOO_LARGE", 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("BAD_REQUEST", 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return fail("BAD_REQUEST", 400);
  if ((body as Record<string, unknown>)[HONEYPOT_FIELD]) return fail("BAD_REQUEST", 400);

  const parsed = schema.safeParse(body);
  if (!parsed.success) return validationFailure(parsed.error);
  return deliver({ form, fields: parsed.data });
}

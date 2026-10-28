// @vitest-environment node
import { describe, expect, it } from "vitest";
import { POST as contact } from "@/app/api/contact/route";
import { POST as apply } from "@/app/api/careers/apply/route";
import { GET as tracking } from "@/app/api/tracking/route";
import { createRateLimiter } from "@/lib/server/rate-limit";

const valid = { name: "Asha", email: "asha@example.com", subject: "Quote", phone: "+91 6238399011", message: "Hello" };
let ip = 0;
/** Each request gets its own IP so the shared rate limiter doesn't interfere between tests. */
const jsonRequest = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("POST /api/contact", () => {
  it("validates, then reports that delivery is not configured (never fakes success)", async () => {
    const res = await contact(jsonRequest(valid));
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, code: "DELIVERY_NOT_CONFIGURED" });
  });

  it("returns field errors for invalid input", async () => {
    const res = await contact(jsonRequest({ ...valid, email: "bad" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe("VALIDATION");
    expect(body.fieldErrors.email[0]).toMatch(/valid email/);
  });

  it("rejects honeypot submissions, bad JSON, wrong content type and oversized bodies", async () => {
    expect((await contact(jsonRequest({ ...valid, form_botcheck: "x" }))).status).toBe(400);
    expect((await contact(jsonRequest("{not json"))).status).toBe(400);
    expect((await contact(jsonRequest(valid, { "content-type": "text/plain" }))).status).toBe(415);
    expect((await contact(jsonRequest({ ...valid, message: "x".repeat(20_000) }))).status).toBe(413);
  });

  it("rate limits repeated submissions from one IP", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await contact(jsonRequest({}, { "x-forwarded-for": "10.9.9.9" }))).status);
    expect(statuses.slice(0, 5)).toEqual([422, 422, 422, 422, 422]);
    expect(statuses[5]).toBe(429);
  });
});

describe("POST /api/careers/apply", () => {
  const form = (overrides: Record<string, string | File> = {}) => {
    const fd = new FormData();
    const fields = { position: "Logistics Manager", applicant_name: "Asha", email: "a@b.co", phone: "9895258623", ...overrides };
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    if (!("cv" in overrides)) fd.set("cv", new File(["%PDF"], "cv.pdf", { type: "application/pdf" }));
    return new Request("http://localhost/api/careers/apply", { method: "POST", body: fd, headers: { "x-forwarded-for": `10.1.0.${++ip}` } });
  };

  it("accepts a valid application up to the delivery step", async () => {
    expect((await apply(form())).status).toBe(503);
  });

  it("rejects bad files and unknown positions", async () => {
    const res = await apply(form({ cv: new File(["MZ"], "cv.exe"), position: "CEO" }));
    expect(res.status).toBe(422);
    const { fieldErrors } = await res.json();
    expect(fieldErrors.cv[0]).toMatch(/PDF, DOC or DOCX/);
    expect(fieldErrors.position[0]).toMatch(/not open/);
  });
});

describe("GET /api/tracking", () => {
  const get = (id: string) => tracking(new Request(`http://localhost/api/tracking?tracking_id=${encodeURIComponent(id)}`, { headers: { "x-forwarded-for": `10.2.0.${++ip}` } }));

  it("returns not_connected — no fake results — for a valid number", async () => {
    const res = await get("MCL123");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "not_connected" });
  });

  it("rejects invalid numbers", async () => {
    expect((await get("<x>")).status).toBe(422);
  });
});

describe("createRateLimiter", () => {
  it("allows `limit` calls per window, then reports seconds to wait, then resets", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 60_000 });
    expect([rl.check("a", 0), rl.check("a", 1), rl.check("a", 2)]).toEqual([0, 0, 60]);
    expect(rl.check("b", 2)).toBe(0);
    expect(rl.check("a", 60_000)).toBe(0);
  });
});

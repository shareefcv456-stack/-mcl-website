import { describe, expect, it } from "vitest";
import { applicationSchema, contactSchema, cvError, reviewSchema, trackingIdSchema } from "@/lib/validation/forms";

const valid = { name: "Asha", email: "asha@example.com", subject: "Air cargo to UK", phone: "+91 62383 99011", message: "50 kg of books" };
const firstError = (r: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }, field: string) =>
  r.error?.issues.find((i) => i.path[0] === field)?.message;

describe("contactSchema", () => {
  it("accepts a complete enquiry and trims whitespace", () => {
    expect(contactSchema.parse({ ...valid, name: "  Asha  " }).name).toBe("Asha");
  });

  it("strips unknown fields", () => {
    expect(contactSchema.parse({ ...valid, isAdmin: true })).not.toHaveProperty("isAdmin");
  });

  it.each(["name", "email", "subject", "phone", "message"])("requires %s", (field) => {
    const r = contactSchema.safeParse({ ...valid, [field]: "   " });
    expect(r.success).toBe(false);
    expect(firstError(r, field)).toMatch(/^Please enter your/);
  });

  it("rejects malformed email and phone", () => {
    const r = contactSchema.safeParse({ ...valid, email: "name@", phone: "call me" });
    expect(firstError(r, "email")).toBe("Enter a valid email address, e.g. name@example.com.");
    expect(firstError(r, "phone")).toMatch(/valid phone number/);
  });

  it("enforces the live form's max lengths", () => {
    expect(contactSchema.safeParse({ ...valid, name: "x".repeat(101) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: "x".repeat(100) }).success).toBe(true);
  });
});

describe("reviewSchema / applicationSchema", () => {
  it("validates the review form", () => {
    expect(reviewSchema.safeParse({ name: "A", email: "a@b.co", message: "Great" }).success).toBe(true);
    expect(reviewSchema.safeParse({ name: "A", email: "a@b.co", message: "" }).success).toBe(false);
  });

  it("validates the application text fields", () => {
    const ok = { position: "Logistics Manager", applicant_name: "A", email: "a@b.co", phone: "9895258623" };
    expect(applicationSchema.safeParse(ok).success).toBe(true);
    expect(applicationSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
  });
});

describe("cvError", () => {
  it("accepts PDF, DOC and DOCX up to 5 MB", () => {
    expect(cvError({ name: "cv.PDF", size: 1000 })).toBeNull();
    expect(cvError({ name: "cv.docx", size: 5 * 1024 * 1024 })).toBeNull();
  });

  it("rejects missing, wrong type and oversized files", () => {
    expect(cvError(null)).toBe("Please attach your CV.");
    expect(cvError({ name: "cv.exe", size: 10 })).toBe("Upload your CV as a PDF, DOC or DOCX file.");
    expect(cvError({ name: "cv.pdf", size: 5 * 1024 * 1024 + 1 })).toBe("Your CV must be 5 MB or smaller.");
  });
});

describe("trackingIdSchema", () => {
  it.each(["MCL123", "AWB-0042-77", "  abc  "])("accepts %j", (id) => {
    expect(trackingIdSchema.safeParse(id).success).toBe(true);
  });

  it.each([
    ["", "Please enter your shipment / AWB tracking number."],
    ["ab", "Use letters, numbers or hyphens (at least 3 characters)."],
    ["MCL 123", "Use letters, numbers or hyphens (at least 3 characters)."],
    ["<script>", "Use letters, numbers or hyphens (at least 3 characters)."],
    ["x".repeat(101), "Tracking numbers are at most 100 characters."],
  ])("rejects %j", (id, message) => {
    expect(trackingIdSchema.safeParse(id).error?.issues[0].message).toBe(message);
  });
});

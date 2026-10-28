import { z } from "zod";

// Shared by the client forms (React Hook Form) and the API route handlers.
// Fields and required-ness follow the live site's forms; max lengths match its inputs.

const required = (label: string, max: number) =>
  z
    .string({ error: `Please enter your ${label}.` })
    .trim()
    .min(1, `Please enter your ${label}.`)
    .max(max, `Please keep this under ${max} characters.`);

const email = (max: number) =>
  required("email", max).pipe(z.email("Enter a valid email address, e.g. name@example.com."));

const phone = (max: number) =>
  required("phone number", max).regex(
    /^\+?[\d\s()-]{6,}$/,
    "Enter a valid phone number using digits, spaces, +, - or brackets.",
  );

export const contactSchema = z.object({
  name: required("first name", 100),
  email: email(254),
  subject: required("subject", 100),
  phone: phone(100),
  message: required("message", 5000),
});
export type ContactInput = z.input<typeof contactSchema>;

/** The quote popup posts the same fields as the contact form (it is the live site's contact form). */
export const quoteSchema = contactSchema;

export const reviewSchema = z.object({
  name: required("name", 100),
  email: email(100),
  message: required("comment", 5000),
});
export type ReviewInput = z.input<typeof reviewSchema>;

export const newsletterSchema = z.object({ email: email(254) });
export type NewsletterInput = z.input<typeof newsletterSchema>;

export const applicationSchema = z.object({
  position: z.string().trim().min(1).max(255),
  applicant_name: required("name", 255),
  email: email(255),
  phone: phone(255),
});
export type ApplicationInput = z.input<typeof applicationSchema>;

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];

/** Validates an uploaded CV (browser File or server File). Returns an error message or null. */
export function cvError(file: { name: string; size: number } | null | undefined): string | null {
  if (!file || file.size === 0) return "Please attach your CV.";
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!CV_EXTENSIONS.includes(ext)) return "Upload your CV as a PDF, DOC or DOCX file.";
  if (file.size > CV_MAX_BYTES) return "Your CV must be 5 MB or smaller.";
  return null;
}

/** Shipment / AWB number: letters, digits and hyphens, 3–100 characters. */
export const trackingIdSchema = z
  .string()
  .trim()
  .min(1, "Please enter your shipment / AWB tracking number.")
  .max(100, "Tracking numbers are at most 100 characters.")
  .regex(/^[A-Za-z0-9-]{3,}$/, "Use letters, numbers or hyphens (at least 3 characters).");

/** Name of the hidden spam-trap field (same name the live forms use). */
export const HONEYPOT_FIELD = "form_botcheck";

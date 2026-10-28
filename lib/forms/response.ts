/** JSON contract between the form API routes and the client forms. */

export type FormErrorCode =
  | "VALIDATION"
  | "BAD_REQUEST"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "DELIVERY_NOT_CONFIGURED"
  | "DELIVERY_FAILED";

export type FormResponse =
  | { ok: true }
  | { ok: false; code: FormErrorCode; message: string; fieldErrors?: Record<string, string[]> };

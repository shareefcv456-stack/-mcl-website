/**
 * Outbound email for form submissions.
 *
 * No email provider has been approved yet, so `getMailProvider()` returns null and the API
 * responds `DELIVERY_NOT_CONFIGURED` — the UI tells the visitor nothing was sent.
 * To enable delivery: implement `MailProvider` for the chosen service (Resend, SES, SMTP…),
 * read its credentials from server-side env vars (see .env.example), and return it here.
 */

export interface OutboundMessage {
  /** Which form produced the message, e.g. "contact" or "quote". */
  form: string;
  /** Validated form fields. */
  fields: Record<string, string>;
  attachments?: { filename: string; content: ArrayBuffer; contentType: string }[];
}

export interface MailProvider {
  /** Must throw if the provider did not accept the message. */
  send(message: OutboundMessage): Promise<void>;
}

export function getMailProvider(): MailProvider | null {
  return null;
}

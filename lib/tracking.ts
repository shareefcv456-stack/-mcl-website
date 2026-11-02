/**
 * Shipment tracking: IMD Courier's tracking API, called from the server only.
 *
 * Ported from the old Django site (MEEM_FILE web/utils.py, fetch_tracking_from_api):
 *   GET IMD_TRACKING_API_URL?api_company_id=…&customer_code=…&tracking_no=…   (10 s timeout)
 * The response is a JSON array; its first record carries `errors`, `tracking_no`, `forwarding_no2`,
 * `docket_info` (a list of [label, value] pairs) and `docket_events` (objects with event_at, event_location,
 * event_description, event_remark). Configuration comes from server-only environment variables, so the URL and the
 * customer code never reach the browser. If any is missing, every lookup returns `not_connected`.
 *
 * Only values IMD actually returned are passed on; nothing is filled in or guessed. HTTP 200 alone is not success:
 * the body must be IMD's list with a record that is not flagged `errors` and carries shipment data.
 */

export interface TrackingEvent {
  /** As IMD sends it (its date format is not documented, so it is shown, not parsed). */
  at: string;
  location?: string;
  description: string;
  remark?: string;
}

export interface TrackingDetails {
  status?: string;
  origin?: string;
  destination?: string;
  bookingDate?: string;
  deliveryDate?: string;
}

export type TrackingFailure = "timeout" | "network" | "http" | "invalid_response";

export type TrackingResult =
  | { status: "not_connected" }
  | { status: "not_found" }
  | { status: "unavailable"; reason: TrackingFailure }
  | { status: "found"; trackingId: string; forwardingNo?: string; details: TrackingDetails; events: TrackingEvent[] };

export interface TrackingProvider {
  lookup(trackingId: string): Promise<TrackingResult>;
}

const TIMEOUT_MS = 10_000;

/** A non-empty trimmed string, or undefined (IMD fields may be missing, null, numbers or blank). */
const text = (v: unknown) => {
  const s = typeof v === "number" ? String(v) : typeof v === "string" ? v.trim() : "";
  return s && s !== "-" ? s : undefined;
};

/** docket_info → { normalised_label: value }, keyed the way the Django code did ("Booking Date" → booking_date). */
function docketInfo(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!Array.isArray(raw)) return out;
  for (const pair of raw) {
    if (!Array.isArray(pair) || pair.length < 2) continue;
    const key = text(pair[0]);
    const value = text(pair[1]);
    if (key && value) out[key.toLowerCase().replace(/\s+/g, "_")] = value;
  }
  return out;
}

function docketEvents(raw: unknown): TrackingEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((e) => {
    if (!e || typeof e !== "object") return [];
    const r = e as Record<string, unknown>;
    const at = text(r.event_at);
    const description = text(r.event_description);
    if (!at || !description) return [];
    return [{ at, description, location: text(r.event_location), remark: text(r.event_remark) }];
  });
}

/** Maps IMD's response body to a TrackingResult. Exported for tests. */
export function mapImdResponse(body: unknown, trackingId: string): TrackingResult {
  if (!Array.isArray(body)) return { status: "unavailable", reason: "invalid_response" };
  const record = body[0];
  if (!record || typeof record !== "object") return { status: "not_found" };
  const r = record as Record<string, unknown>;
  if (r.errors === true) return { status: "not_found" };

  const info = docketInfo(r.docket_info);
  const events = docketEvents(r.docket_events);
  const details: TrackingDetails = {
    status: info.status,
    origin: info.origin,
    destination: info.destination,
    bookingDate: info.booking_date,
    deliveryDate: info.delivery_date_and_time ?? info.delivery_date,
  };
  // A record with nothing usable in it is not a shipment we can show.
  if (!Object.values(details).some(Boolean) && events.length === 0) return { status: "not_found" };
  return { status: "found", trackingId: text(r.tracking_no) ?? trackingId, forwardingNo: text(r.forwarding_no2), details, events };
}

export function createImdProvider(config: { url: string; companyId: string; customerCode: string }, fetcher: typeof fetch = fetch): TrackingProvider {
  return {
    async lookup(trackingId) {
      const query = new URLSearchParams({ api_company_id: config.companyId, customer_code: config.customerCode, tracking_no: trackingId });
      let res: Response;
      try {
        res = await fetcher(`${config.url}?${query}`, { method: "GET", headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
      } catch (err) {
        // The timeout arrives as a DOMException, which is not an Error subclass in every runtime: check its name.
        const name = (err as { name?: unknown } | null)?.name;
        const reason = name === "TimeoutError" || name === "AbortError" ? "timeout" : "network";
        // Log the cause only: never the URL (it carries the customer code) or the visitor's tracking number.
        console.error(`[tracking] IMD request failed: ${reason} (${String(name)})`);
        return { status: "unavailable", reason };
      }
      if (!res.ok) {
        console.error(`[tracking] IMD responded HTTP ${res.status}`);
        return { status: "unavailable", reason: "http" };
      }
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        console.error("[tracking] IMD response was not valid JSON");
        return { status: "unavailable", reason: "invalid_response" };
      }
      const result = mapImdResponse(body, trackingId);
      if (result.status === "unavailable") console.error("[tracking] IMD response was not the expected list");
      return result;
    },
  };
}

export function getTrackingProvider(): TrackingProvider | null {
  const url = process.env.IMD_TRACKING_API_URL?.trim();
  const companyId = process.env.IMD_TRACKING_API_COMPANY_ID?.trim();
  const customerCode = process.env.IMD_TRACKING_CUSTOMER_CODE?.trim();
  return url && companyId && customerCode ? createImdProvider({ url, companyId, customerCode }) : null;
}

export async function trackShipment(trackingId: string): Promise<TrackingResult> {
  const provider = getTrackingProvider();
  return provider ? provider.lookup(trackingId) : { status: "not_connected" };
}

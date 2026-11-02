import { afterEach, describe, expect, it, vi } from "vitest";
import { createImdProvider, getTrackingProvider, mapImdResponse, trackShipment } from "@/lib/tracking";

// Shapes follow the old Django integration (MEEM_FILE web/utils.py and templates/tracking1.html). All values are
// made up; no real shipment data and no requests to IMD.
const CONFIG = { url: "https://imd.example/api/tracking_api/get_tracking_data", companyId: "15", customerCode: "TEST" };
const record = {
  errors: false,
  tracking_no: "TEST123",
  forwarding_no2: "FWD-1",
  docket_info: [["Status", "In Transit"], ["Booking Date", "01-11-2026"], ["Origin", "Kochi"], ["Destination", "Dubai"], ["Delivery Date And Time", "-"], ["Consignee Name", "Someone"]],
  docket_events: [
    { event_at: "01-11-2026 10:00", event_location: "Kochi", event_description: "Booked", event_remark: "" },
    { event_at: "02-11-2026 08:30", event_location: "Dubai", event_description: "Arrived at hub", event_remark: "On time" },
  ],
};

const respond = (body: unknown, init?: ResponseInit) => vi.fn<typeof fetch>(async () => new Response(typeof body === "string" ? body : JSON.stringify(body), init));
const lookup = (fetcher: typeof fetch, id = "TEST123") => createImdProvider(CONFIG, fetcher).lookup(id);

afterEach(() => vi.unstubAllEnvs());
vi.spyOn(console, "error").mockImplementation(() => {});

describe("IMD tracking provider", () => {
  it("sends a GET with the company id, customer code and tracking number, and a 10 s timeout", async () => {
    const fetcher = respond([record]);
    await lookup(fetcher, "AB-12");
    const [url, init] = fetcher.mock.calls[0];
    const u = new URL(String(url));
    expect(`${u.origin}${u.pathname}`).toBe(CONFIG.url);
    expect(Object.fromEntries(u.searchParams)).toEqual({ api_company_id: "15", customer_code: "TEST", tracking_no: "AB-12" });
    expect(init).toMatchObject({ method: "GET", cache: "no-store" });
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("maps a found shipment to genuine values only", async () => {
    expect(await lookup(respond([record]))).toEqual({
      status: "found",
      trackingId: "TEST123",
      forwardingNo: "FWD-1",
      // "-" means no value; names (consignee, receiver) are not passed on.
      details: { status: "In Transit", origin: "Kochi", destination: "Dubai", bookingDate: "01-11-2026", deliveryDate: undefined },
      events: [
        { at: "01-11-2026 10:00", location: "Kochi", description: "Booked", remark: undefined },
        { at: "02-11-2026 08:30", location: "Dubai", description: "Arrived at hub", remark: "On time" },
      ],
    });
  });

  it("treats errors:true, an empty list and an empty record as not found", async () => {
    expect(await lookup(respond([{ errors: true }]))).toEqual({ status: "not_found" });
    expect(await lookup(respond([]))).toEqual({ status: "not_found" });
    expect(await lookup(respond([{ errors: false, docket_info: [], docket_events: [] }]))).toEqual({ status: "not_found" });
  });

  it("does not treat HTTP 200 with an unexpected body as success", async () => {
    expect(await lookup(respond({ message: "ok" }))).toEqual({ status: "unavailable", reason: "invalid_response" });
    expect(await lookup(respond("<html>Customer Code required</html>"))).toEqual({ status: "unavailable", reason: "invalid_response" });
  });

  it("reports HTTP errors, network failures and timeouts as unavailable", async () => {
    expect(await lookup(respond("Forbidden", { status: 403 }))).toEqual({ status: "unavailable", reason: "http" });
    expect(await lookup(respond("Error", { status: 500 }))).toEqual({ status: "unavailable", reason: "http" });
    expect(await lookup(vi.fn<typeof fetch>(async () => { throw new TypeError("fetch failed"); }))).toEqual({ status: "unavailable", reason: "network" });
    expect(await lookup(vi.fn<typeof fetch>(async () => { throw new DOMException("timed out", "TimeoutError"); }))).toEqual({ status: "unavailable", reason: "timeout" });
  });

  it("survives malformed docket_info and missing or malformed docket_events", () => {
    const found = mapImdResponse([{ tracking_no: "X1", docket_info: [["Status"], "bad", [null, "v"], ["Status", "Delivered"]], docket_events: "nope" }], "X1");
    expect(found).toEqual({ status: "found", trackingId: "X1", forwardingNo: undefined, details: { status: "Delivered", origin: undefined, destination: undefined, bookingDate: undefined, deliveryDate: undefined }, events: [] });
    const events = mapImdResponse([{ docket_info: {}, docket_events: [null, { event_at: "t" }, { event_at: "t", event_description: "Picked up" }] }], "X2");
    expect(events.status === "found" && events.events).toEqual([{ at: "t", description: "Picked up", location: undefined, remark: undefined }]);
  });

  it("never puts the customer code or tracking number in its logs", async () => {
    const log = vi.mocked(console.error);
    log.mockClear();
    await lookup(respond("Forbidden", { status: 403 }), "SECRETAWB");
    expect(log.mock.calls.flat().join(" ")).not.toMatch(/TEST|SECRETAWB|imd\.example/);
  });
});

describe("configuration", () => {
  it("is not connected unless the URL, company id and customer code are all set", async () => {
    vi.stubEnv("IMD_TRACKING_API_URL", CONFIG.url);
    vi.stubEnv("IMD_TRACKING_API_COMPANY_ID", "15");
    vi.stubEnv("IMD_TRACKING_CUSTOMER_CODE", "");
    expect(getTrackingProvider()).toBeNull();
    expect(await trackShipment("TEST123")).toEqual({ status: "not_connected" });
    vi.stubEnv("IMD_TRACKING_CUSTOMER_CODE", "TEST");
    expect(getTrackingProvider()).not.toBeNull();
  });
});

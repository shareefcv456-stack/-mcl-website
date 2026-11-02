# IMD Courier Live Tracking — Integration Report

Date: 2026-11-02 · Nothing committed, pushed or deployed · MEEM_FILE was only read, never modified.

## Status

| Item | Status |
|---|---|
| Server-side integration, ported from the Django code | **Implemented** |
| Tested against a local mock of IMD (same response shape) | **Passing** |
| Tested against the production IMD API | **Not done**: no authorised test tracking number exists (see *Blockers*) |
| Live tracking working for customers | **Unverified** until one real lookup succeeds |

## Source files inspected (MEEM_FILE, read-only)

- `web/utils.py` — `fetch_tracking_from_api`:
  - **Request:** `GET` with `api_company_id`, `customer_code` and `tracking_no`, and a 10 s timeout.
  - **Result checks:** the response must be a non-empty list whose first record isn't flagged `errors: true`.
  - **Fields read:** `tracking_no`, `forwarding_no2`, `docket_info` (a list of `[label, value]` pairs, keyed as lower-case snake case) and `docket_events`.
- `web/views.py` — the tracking view. It falls back to this API when a number isn't in the local database, and returns `None` → "Tracking ID not found".
- `templates/tracking1.html` — the fields actually displayed:
  - **Shipment details:** `status`, `booking_date`, `destination` and `delivery_date_and_time`, plus the consignee and receiver names.
  - **History events:** `event_at`, `event_location`, `event_description` and `event_remark`.
- **Test data:** there's no authorised test tracking number anywhere in the source. The only tracking numbers are in its database, and those belong to real customers, so none were used.

## Target files changed (mcl-next)

| File | Change |
|---|---|
| `lib/tracking.ts` | IMD provider: server-side `fetch` (GET, `URLSearchParams`, `AbortSignal.timeout(10_000)`, `cache: "no-store"`), response mapping and error handling. Reads the three server-only environment variables; if any is empty, every lookup returns `not_connected` |
| `app/tracking/page.tsx` | `await connection()` before the lookup, so IMD is only called for a real request. Without it, Next's prerender pass started a fetch and abandoned it, which logged a false "network" failure on every lookup |
| `app/api/tracking/route.ts` | Returns HTTP 502 for `unavailable`. Still `/api/tracking?tracking_id=…`, so there's no duplicate route |
| `components/tracking/TrackingStatus.tsx` | Shows the status, forwarding number, origin, destination, booking and delivery dates (only those returned) and the full event history with remarks. Dates appear exactly as IMD sends them. Adds a "Tracking is temporarily unavailable" state |
| `components/tracking/TrackingForm.tsx` | Loading state ("Tracking…", disabled button, `aria-busy`) and no repeat submissions while a lookup runs. Used by both the home-page card and the Tracking page |
| `playwright.config.ts` | The e2e server runs with a blank customer code, so the tests' invented numbers can never reach production IMD |
| `.env.example` | Documents the IMD variables; the customer code stays blank |
| `tests/unit/tracking.test.ts` | New: 8 tests (see below) |
| `.env.local` (git-ignored) | `IMD_TRACKING_CUSTOMER_CODE` set to the code from the Django source. It was empty before |

**How it works:** both forms submit to `/tracking?tracking_id=…`, whose server component calls `trackShipment()`. The customer code and the IMD URL never reach the browser.

## Behaviour

| IMD outcome | Visitor sees | API |
|---|---|---|
| A record with shipment data | Status, details and history (genuine values only) | 200 `found` |
| `errors: true`, an empty list, or a record with no usable data | "No shipment found for …" | 200 `not_found` |
| HTTP 403 / 500 / any non-2xx | "Tracking is temporarily unavailable" | 502 `unavailable: http` |
| A body that isn't a list, or invalid JSON (including HTTP 200 with HTML) | Same | 502 `unavailable: invalid_response` |
| No answer within 10 s | Same | 502 `unavailable: timeout` |
| DNS or connection failure | Same | 502 `unavailable: network` |
| Configuration incomplete | "Live shipment status isn't connected" | 200 `not_connected` |
| Missing or invalid tracking number | Validation message; IMD isn't called | 422 |

**Data handling:**
- **Malformed data:** bad `docket_info` pairs and `docket_events` entries are skipped, and a missing or non-list field is treated as empty. A "-" value counts as no value.
- **Names left out:** the consignee and receiver names that the Django page showed aren't displayed. They're personal data, and they weren't in the list of fields to preserve.
- **Logs:** only the cause (e.g. `IMD responded HTTP 403`), never the URL, the customer code or the visitor's tracking number.

## Test results

- `tsc --noEmit`: pass.
- `eslint .`: pass.
- `vitest`: **55 / 55** pass (47 existing and 8 new tracking tests). The new tests cover:
  - the request's method, parameters, timeout and no caching;
  - mapping of a found shipment;
  - `errors: true`, an empty list and an empty record → not found;
  - HTTP 200 with a non-list or HTML body → not treated as success;
  - HTTP 403 and 500, network failures and timeouts;
  - malformed `docket_info` and `docket_events`;
  - no secrets or tracking numbers in the logs;
  - not connected when a variable is missing.
- `next build`: pass.
- **Client bundle scan:** no occurrence of the IMD host, `customer_code`, the variable names or the code value in `.next/static`.
- **End to end:** Chrome against the production build, pointed at a local mock IMD with the same response shape and made-up data:
  - **Found shipment:** the home-page card showed "Tracking…" and a disabled button during the lookup, blocked a second click, then rendered the found shipment.
  - **Failures:** a not-found number, a 403 and a timeout each showed the right message. The timeout appeared after 10.1 s.
  - **API route:** 200, 502 and 422 as expected.
  - **Browser requests:** zero, from the browser to IMD.
  - **Request count:** 7 lookups made exactly 7 upstream requests, with no duplicates.
  - **Phones:** no horizontal scrolling at 390 px.
- **Not run:** the browser end-to-end suite, which needs a fresh build on port 3100. Its config now keeps IMD disconnected.
- **Production IMD:** not called.

## Remaining blockers

1. **An authorised test tracking number.** None exists in the source or the brief. To confirm the live integration, MCL or IMD should provide one, then run:
   `curl "https://<site>/api/tracking?tracking_id=<TEST_NUMBER>"`
   - **Expected:** HTTP 200 and `"status":"found"`.
   - **On a 502:** check the server log line `[tracking] …` for the exact cause, such as `HTTP 403`, an invalid response, or a timeout.
2. **Account confirmation.** The company ID (15) and customer code come from the old Django code. IMD should confirm they are MCL's authorised API credentials and still active.
3. **IP allow-listing.** If IMD restricts by IP, the production server's IP must be approved. This was the open question from `TRACKING_STATUS_REPORT.md`; a 403 would point to it.
4. **Unverified labels.** The `docket_info` labels for origin and booking/delivery dates are inferred from the Django template:
   - **Origin:** "Origin" is assumed, because the Django page never showed an origin.
   - **Booking date:** "Booking Date".
   - **Delivery date:** "Delivery Date And Time" or "Delivery Date".

   If IMD uses other labels, those rows are simply omitted rather than shown wrong. A real response will settle it in a minute.
5. **Restart the development server** (`npm run dev`) so it picks up the new `.env.local` value.

## Deployment environment variables (server-only, never `NEXT_PUBLIC_`)

| Variable | Value |
|---|---|
| `IMD_TRACKING_API_URL` | `https://admin.imdcourierllp.com/api/tracking_api/get_tracking_data` |
| `IMD_TRACKING_API_COMPANY_ID` | `15` |
| `IMD_TRACKING_CUSTOMER_CODE` | The code issued by IMD; set it in the host's secret settings, never in git |

If any of these is missing, the site shows "Live shipment status isn't connected" instead of failing.

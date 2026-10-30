# Tracking API integration report — IMD Courier

**Status: blocked — the API contract could not be established from available evidence. No integration has been built.**
The MCL Tracking page keeps its current, honest behaviour: it validates the number and says live tracking isn't connected. It never shows invented results.

Date tested: 2026-10-29
Endpoint: `https://admin.imdcourierllp.com/api/tracking_api/get_tracking_data` (production; no test or sandbox endpoint is known)
Tested from: a developer machine, server-to-server with `curl`, no browser

## Requests attempted

None of these requests contained a tracking number, customer code, credential or customer data.

| # | Request | HTTP status | Response body |
|---|---|---|---|
| 1 | `OPTIONS` with `Origin: https://www.meemcontinental.com` and `Access-Control-Request-Method: POST` | 200 | `[{"errors":true,"tracking_no":"Customer Code required"}]` |
| 2 | `GET`, no parameters | 200 | same as 1 |
| 3 | `POST`, empty body | 200 | same as 1 |
| 4 | `POST`, `Content-Type: application/json`, body `{}` | 200 | same as 1 |

## What the responses show

- **Customer code required.** The API needs a customer code (an account identifier issued by IMD) before it does anything. MCL's customer code is not in the project, its environment files or its docs.
- **No method distinction.** `GET`, `POST` and `OPTIONS` all return HTTP 200 with the same body, so the method alone doesn't reveal the intended request.
- **Errors are returned with HTTP 200.** The error is a JSON array of objects with `"errors": true`, but the response header says `Content-Type: text/html`. The integration will need to read the JSON body and check `errors`, not rely on the status code or content type.
- **The error key `tracking_no` hints at the tracking-number parameter name, but doesn't confirm it.** The message under that key is about the customer code.
- **CORS.** The preflight returns `Access-Control-Allow-Origin: https://www.meemcontinental.com` with credentials allowed. Calling from the browser isn't needed anyway: the new site will call the API from its own server, where CORS doesn't apply and the customer code stays secret.
- **Server details.** The API is served through Cloudflare from a CodeIgniter backend, which sets a `ci_sessions` cookie. It's unknown whether that session matters for authentication.

## What the current live site shows

`https://www.meemcontinental.com/tracking` submits a plain HTML form (`GET ?tracking_id=…`) to its own server. The IMD API is not called from the browser: no script on the page or in `/static/js/script.js` references it. The live site's request to IMD therefore happens server-side, and its parameter names and customer code are not publicly visible.

No real tracking number was sent from either site, because none was authorized for testing.

## Still unknown

1. MCL's **customer code**, and how it should be sent: query string, form field, JSON body or header.
2. The exact **parameter names** for the customer code and the tracking or AWB number.
3. The intended **HTTP method** and body format: query string, `application/x-www-form-urlencoded` or JSON.
4. Whether any other **authentication** is needed: an API key, a token, IP allow-listing, or the `ci_sessions` session.
5. The **success response format**: the field names for the current status, the list of events, dates and time zone, locations, and delivery or recipient details.
6. The responses for an **unknown tracking number** and for an **invalid customer code**, and any **rate limits**.
7. A **test tracking number** that IMD approves for testing, or confirmation that one of MCL's real numbers may be used.

## Questions to send to IMD Courier

> We're integrating your tracking API (`/api/tracking_api/get_tracking_data`) into Meem Continental Logistics' new website. Please could you send:
> 1. The API documentation for this endpoint, or a working Postman request with credentials removed.
> 2. Our customer code, and how it should be sent (parameter name; query string, form field, JSON body or header).
> 3. The parameter name for the tracking/AWB number, and the HTTP method and content type you expect.
> 4. Whether any other authentication is needed (API key, token, IP allow-listing, session cookie).
> 5. Example responses for a delivered shipment, an in-transit shipment, an unknown number and an invalid customer code, with personal data removed.
> 6. A test tracking number we may use, and any rate limits.

## Next action

Please send IMD's documentation or a sanitized working request, the customer code (as a server-side environment variable, not in chat if possible), and an approved test tracking number.

## What happens once the contract is known

The website is already set up for this, so the integration is small:

- **Server side only:** `lib/tracking.ts` has a `TrackingProvider` hook. It will call IMD from the server, through the existing `GET /api/tracking` route and the `/tracking` page, so the customer code never reaches the browser.
- **Configuration:** the endpoint and customer code will live in server environment variables (for example `TRACKING_API_URL` and a customer-code variable), documented in `.env.example` with no real values. No `.env` file is committed.
- **Display:** IMD's real response will be mapped to the existing result shape (current status and dated events with locations) and shown on the existing Tracking page.
- **Error handling:** unknown numbers, empty responses, `errors: true` and timeouts will each get a clear message.
- **Form:** the tracking form will get a loading state and protection against double submits. It has neither today.
- **Logging:** full responses won't be logged, since they may contain personal data.

# MCL Shipment Tracking — Status Report

Audit date: 2026-10-30. Scope: the `mcl-next` project (Next.js 16.4.3). Audit only: no application code, config or env file was changed.
No request was sent to `admin.imdcourierllp.com` during this audit. The current code cannot send one (see section 4).

---

## 1. Executive Summary

- **Customers can type a tracking number and get a clear, honest answer, but live IMD tracking is not connected.** Every valid number gets the message "Live shipment status isn't connected to this website yet", with a phone number and a WhatsApp link.
- **Where it stops:** `lib/tracking.ts:26-28`. `getTrackingProvider()` always returns `null`, so `trackShipment()` returns `{ status: "not_connected" }` (`lib/tracking.ts:30-33`). The code never builds an IMD request, never reads an IMD setting and never makes a network call.
- **The code reads no tracking environment variables.** `TRACKING_API_URL` and `TRACKING_API_KEY` appear only in a code comment (`lib/tracking.ts:5`), in commented-out lines in `.env.example:17-18`, and in `README.md:88`. No variable exists yet for the IMD **company ID** or **customer code**.
- **The parts that work are tested:** the form, validation (in the browser and on the server), the page and the JSON route, rate limiting on the JSON route, and the mobile layout. Unit, end-to-end and live local checks all pass (section 9).
- **Blocked on IMD:** the request format, the authentication, the customer code, the company ID, whether IMD only accepts calls from approved server IP addresses (IP allowlisting), and the response format. None of these has been confirmed. The old site's 403 and its Django error do not tell us how the new integration will behave.
- **Gaps that `mcl-next` can fix itself, without IMD:**
  1. There is no loading state and no protection against double submits.
  2. There is no result type for "service unavailable", so a 403, a timeout or a network error has nowhere to go.
  3. There is no rate limit on the `/tracking` page path.
  4. `.env.example` is ignored by git, so it is not in the repository.

## 2. Current MCL Tracking Implementation Status

| # | Component | Status | Evidence |
|---|---|---|---|
| 1 | Input validation | **Implemented and verified** | `lib/validation/forms.ts:65-70` (trimmed; letters, digits and hyphens; 3–100 characters). Used in the browser (`components/tracking/TrackingForm.tsx:32`), the page (`app/tracking/page.tsx:25`) and the API (`app/api/tracking/route.ts:11`). Covered by 8 schema tests, an API 422 test, 2 end-to-end specs × 3 viewports, and local curl checks |
| 2 | Submit button + loading state | **Partially implemented** | The submit button works (verified end to end). There is **no loading state**: `TrackingForm.tsx:65-68` never sets `disabled` or any "pending" state. The page's `<Suspense fallback={<TrackingForm />}>` (`app/tracking/page.tsx:49`) shows a bare form while the result loads, with no "Checking…" message |
| 3 | Duplicate-submit protection | **Not implemented** | `onSubmit` (`TrackingForm.tsx:29-40`) calls `router.push` every time it is clicked. Nothing guards a second click |
| 4 | Frontend → backend connection | **Implemented and verified** | The form opens `GET /tracking?tracking_id=…` (`TrackingForm.tsx:39,43`). The server page then calls `trackShipment()` directly (`app/tracking/page.tsx:30`). **The UI does not use `/api/tracking`.** That route is a separate JSON endpoint, and only the tests call it |
| 5 | Server-side provider | **Partially implemented** | The `TrackingProvider` interface and hook exist (`lib/tracking.ts:22-28`), but nothing implements them and `null` is returned |
| 6 | IMD request | **Not implemented**; **Blocked by missing IMD information** | No `fetch` and no IMD URL anywhere in `app/`, `components/` or `lib/` |
| 7 | Auth + customer code | **Blocked by missing IMD information** | No variable or code. The customer code is not in the project (`API_INTEGRATION_REPORT.md:23`) |
| 8 | Response parsing | **Blocked by missing IMD information** | The success format is unknown. Only the "Customer Code required" error format has been seen (`API_INTEGRATION_REPORT.md:16-19,25`) |
| 9 | Status display | **Implemented but not tested** | The `found` and `not_found` branches exist (`components/tracking/TrackingStatus.tsx:21-42`). Only `not_connected` has been rendered in tests |
| 10 | History / location events | **Implemented but not tested** | An ordered list of time, description and location (`TrackingStatus.tsx:32-39`). No test renders it, and no real data exists |
| 11 | Invalid number handling | **Partially implemented** | Badly formatted numbers are rejected and verified (page alert at `app/tracking/page.tsx:32`, API 422). An unknown but well-formed number has a UI message (`not_found`), but nothing maps an IMD reply to it |
| 12 | HTTP 403 handling | **Not implemented** | The `TrackingResult` union (`lib/tracking.ts:17-20`) has no error or "unavailable" variant |
| 13 | Network / timeout handling | **Not implemented** | There is no timeout and no try/catch. When a provider is added, a hanging upstream call would block the page render (`app/tracking/page.tsx:30`) |
| 14 | Mobile responsiveness | **Implemented and verified** | The input and button stack below 420 px (`TrackingForm.tsx:52`). Playwright on a Pixel 7 viewport passes the tracking journeys and the `/tracking` horizontal-overflow check |

## 3. Frontend Status

- **Entry points:**
  - The home hero card (`components/home/Hero.tsx:92-96`), which uses `TrackingForm` with `compact` and the button label "Track Order".
  - The `/tracking` page (`app/tracking/page.tsx:38-67`).
- **Form** (`components/tracking/TrackingForm.tsx`):
  - It is a real `<form action="/tracking" method="get">` (line 43), so it still works without JavaScript and keeps the old site's `?tracking_id=` URL.
  - With JavaScript, it validates first (line 32). It shows the error inline, sets `aria-invalid`, moves focus to the input (lines 34-35) and clears the error when the user types (line 62).
  - `maxLength={100}` (line 57) matches the schema.
- **Result rendering** (`components/tracking/TrackingStatus.tsx`):
  - `not_connected`: a warning plus phone and WhatsApp contacts (lines 15-20). Verified.
  - `not_found`: an error plus contacts (lines 21-26). Not tested.
  - `found`: the current status and a list of events (lines 27-42). Not tested.
    - Dates use `new Date(ev.at).toLocaleString("en-GB")` on the **server** (line 35). The time zone will be the server's (usually UTC on hosting platforms), not the customer's or IMD's. An unparseable IMD date would print "Invalid Date".
    - The React key `ev.at + ev.description` (line 34) could repeat if IMD sends duplicate events.
- **Missing:**
  - A loading indicator, such as `useTransition` with a disabled button and a "Checking…" label.
  - A guard against double submits.
  - An "unavailable, please try later" message.

## 4. Backend / API Route Status

- **Page path (what customers actually use):** `app/tracking/page.tsx:20-36`.
  - It reads `searchParams.tracking_id`, validates it, then `await trackShipment(...)` inside `<Suspense>`.
  - **It has no rate limit.** This does no harm today. Once IMD is connected, anyone could use this page to send unlimited requests to IMD with MCL's customer code. That could trip IMD's rate limits or WAF and get MCL's server IP blocked.
- **JSON route:** `app/api/tracking/route.ts`.
  - `preflight` gives 5 requests per minute per IP, keyed `tracking:<ip>` (line 8; `lib/server/forms.ts:8,25-30`). Validation failures return 422 (lines 11-14). Responses have `Cache-Control: no-store` (line 15).
  - The rate limiter keeps its counts in memory on each server instance (`lib/server/rate-limit.ts:1-2`). It trusts `X-Forwarded-For` (`lib/server/rate-limit.ts:38-44`), so it needs a proxy in front that overwrites that header.
  - Error codes come from `lib/forms/response.ts:3-9`. There is no code yet for an upstream tracking failure.
- **Provider:** `lib/tracking.ts`. It has the interface and `trackShipment()`, but no implementation. It reads no `process.env`.

## 5. IMD API Integration Status

**Status: not built, blocked by missing IMD information.**

### Request comparison: old site vs new site

| Aspect | Old Django site (user-supplied evidence) | New mcl-next |
|---|---|---|
| Endpoint | `https://admin.imdcourierllp.com/api/tracking_api/get_tracking_data` | None (no URL in code) |
| Method | GET | None |
| Company ID | query param `api_company_id=15` | None. No variable for it |
| Customer code | query param `customer_code` | None. No variable for it |
| Tracking number | query param `tracking_no` | Collected from the customer as `tracking_id`. Never sent anywhere |
| Where the call runs | Server-side, in the Django view | Planned server-side (`lib/tracking.ts` provider). Nothing runs today |
| Last observed result | HTTP 403 Forbidden, then a Django `Tracking matching query does not exist` error | The website shows `not_connected`. It never calls IMD |

### Earlier probes (`API_INTEGRATION_REPORT.md`, 2026-10-29)

Requests with no parameters were sent from a developer machine:

- GET, POST and OPTIONS all returned **HTTP 200** with the body `[{"errors":true,"tracking_no":"Customer Code required"}]` and the header `Content-Type: text/html` (lines 14-19, 25).
- **So a 200 is not proof of success.** The parser must read the JSON body and check for `errors: true`.
- That machine was **not** sent a 403 for a request with no parameters. So IMD/Cloudflare does not block every caller. Whatever caused the old server's 403 is specific to that server's IP or to the parameters it sent. This is a possibility, not something we have confirmed.

### Still unverified

- **Request format:** query string or body, the parameter names, and whether `tracking_no` is still the right name.
- **Auth:** whether the customer code alone is enough, or an API key or token is also needed. Whether the `ci_sessions` cookie matters.
- **Company ID:** whether `15` is correct for MCL and still valid.
- **Customer code:** its value is not in the project. The developer must get it from MCL or IMD.
- **Server IP allowlisting:** whether IMD or Cloudflare only allows listed IP addresses.
- **Response schema:** what delivered, in-transit and not-found replies look like, the field names, date format and time zone, and whether there is more than one shipment per number.

## 6. Environment Variables Required

`.env.local` is **not present** in the project. No `.env*` file other than `.env.example` exists. The running dev server therefore uses the code default for the site URL (`lib/content/site.ts:7`).

| Variable | Purpose | Required? | Current status |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site URL for canonical links, Open Graph and the sitemap (`lib/content/site.ts:7`). **Not an API setting. Must stay `https://www.meemcontinental.com` in production.** | Optional (the code falls back to the same value) | In `.env.example:4`. Missing from `.env.local` (the file is absent) |
| `TRACKING_API_URL` | IMD endpoint. Reserved name, **not read by any code** | Will be required | Commented out in `.env.example:17`. Missing |
| `TRACKING_API_KEY` | Reserved name, **not read by any code**. Only needed if IMD issues a key or token | Unknown (ask IMD) | Commented out in `.env.example:18`. Missing |
| *(no name yet)*, e.g. `TRACKING_CUSTOMER_CODE` | IMD customer code (a secret) | Will be required | **Not defined anywhere**: proposed name only |
| *(no name yet)*, e.g. `TRACKING_COMPANY_ID` | IMD `api_company_id` | Will be required | **Not defined anywhere**: proposed name only |

### Checks

- **No secrets in public variables:** no credential is under `NEXT_PUBLIC_*`. The only public variable is the site URL. The customer code and company ID **must never** use a `NEXT_PUBLIC_` prefix, because Next.js copies those values into the code it sends to browsers.
- **`.env.local` is ignored by git:** yes (`.gitignore:34`, `.env*`).
- **`.env.example` is also ignored by git** by that same `.env*` rule. `git ls-files` does not list it, so a fresh clone of the repo won't contain it. Fix: add `!.env.example` after line 34 of `.gitignore`.
- **Do the names in `.env.example` match the code?** The code reads only `NEXT_PUBLIC_SITE_URL`. The tracking names are placeholders and match the comment in `lib/tracking.ts:5` and `README.md:88`. Neither file has a customer-code or company-ID entry.
- **Local vs production:** locally, the values go in `.env.local`, which `next dev` loads. In production, set them in the hosting platform's server environment settings (or the process environment for `next start`), never in a committed file. No hosting config is in the repo (no `vercel.json` or `Dockerfile`), so the production host and its **outgoing IP address** (the address IMD would see) are unknown.

## 7. Credentials & Information Needed from IMD Courier

Checklist the owner can send to IMD:

- [ ] Confirm the endpoint is `https://admin.imdcourierllp.com/api/tracking_api/get_tracking_data`, and whether a test/sandbox endpoint exists.
- [ ] Confirm the HTTP method (GET?), how parameters are sent (query string, form or JSON), and the exact parameter names (`api_company_id`, `customer_code`, `tracking_no`?).
- [ ] Confirm MCL's **company ID** (the old site used `15`). Is it still correct?
- [ ] MCL's **customer code**. Please send it securely, not by email or chat if possible.
- [ ] Is any **API key or token** required, and how is it sent (header name)?
- [ ] Do you only accept requests from approved server IP addresses? If so, **which IPs are approved today**, and please add MCL's new server IP: `<to be supplied once production hosting is chosen>`.
- [ ] Is there a Cloudflare/WAF rule that blocks certain User-Agents or data-center IP ranges?
- [ ] Sample JSON responses, with personal data removed, for: **delivered**, **in transit**, **number not found**, **invalid customer code**, **wrong company ID**.
- [ ] The full list of error codes and HTTP statuses (is an error always a 200 with `errors: true`? When do you return 403?).
- [ ] Date/time format and time zone of the events.
- [ ] **Rate limits** (requests per minute or day).
- [ ] An **IMD-approved test AWB/tracking number** we may call from development and production.
- [ ] Why the old MCL website's requests began getting **HTTP 403**: was its IP blocked, or its customer code disabled?

## 8. Old Django Website Evidence

**A) What a 403 could mean here.** These are possibilities, not facts:

- The old server's IP is not on IMD's allowlist, or has been removed from it.
- The customer code is missing, wrong, or disabled.
- The `api_company_id` does not match the customer code.
- Cloudflare/WAF blocked the request: a bot rule, the data-center IP's reputation, or a country rule.
- The default User-Agent (for example `python-requests`) is blocked.

A 403 is **not** the same as "invalid tracking number". In the earlier probe, a request with no parameters got a 200 with an error body. So "not found" is probably reported in the body, not as a 403. That is unconfirmed until IMD sends sample responses.

**B) Why Django failed on a missing local Tracking record.** The error "`Tracking matching query does not exist`" is the message of Django's `Tracking.DoesNotExist`. Django raises it when `Tracking.objects.get(...)` finds no row.

The old view probably looked up a **local database row** (a `Tracking` model) after the API call, or instead of it. When the 403 left no data, or the row was never created, `.get()` raised that error. The view did not catch it, so the user got a 500 error.

That is a bug in the old code's error handling. It does not mean the tracking number is wrong. We do not have the old source code to confirm the exact order of these steps.

**C) Do these errors prove anything about the new site?** Not directly.

- The new site has a different server, IP, runtime and HTTP client, and its request has not been written yet.
- The 403 is a useful warning that IP allowlisting or credentials may be a problem. It does not predict the new site's result.
- The Django error comes from Django-specific code that does not exist in `mcl-next`.

**D) What can be fixed where:**

- **In `mcl-next`, no IMD input needed:**
  - Add an error/"unavailable" result type.
  - Add a loading state and a double-submit guard.
  - Rate-limit the `/tracking` page path.
  - Add `!.env.example` to `.gitignore`.
  - Define the env var names.
  - Write the provider skeleton with a timeout and safe logging.
- **In `mcl-next`, once IMD answers:** the request format, auth, response parsing and status mapping.
- **Needs the old Django backend:** catching `DoesNotExist` on the old live site, and checking the old server's outgoing IP and the exact request it sent. That request shows what IMD last accepted.
- **Needs IMD:** everything in section 7, especially allowlisting, the customer code, a test AWB and sample responses.

## 9. Testing Performed & Results

All runs were made on 2026-10-30. No IMD request was possible: the provider is `null`, so the code has no network path to IMD.

| Check | Command | Result |
|---|---|---|
| Full unit suite | `npx vitest run` | **47/47 passed** (4 files) |
| Tracking subset | `npx vitest run tests/unit/api.test.ts tests/unit/validation.test.ts -t track` | **10/10 passed**: 3 accepted IDs, 5 rejected IDs with exact messages (`tests/unit/validation.test.ts:61-75`), API `not_connected` and API 422 (`tests/unit/api.test.ts:70-82`) |
| Typecheck | `npx tsc --noEmit` | Passed (no errors) |
| Local API: valid ID | `GET /api/tracking?tracking_id=TEST-AUDIT-1` | `200 {"status":"not_connected"}`, `cache-control: no-store` |
| Local API: `<script>` / empty / 101 chars | `GET /api/tracking?...` | `422 VALIDATION`, each with the right field message |
| Local API: rate limit | 6 requests from one IP | `200 ×5`, then `429` |
| Local page | `GET /tracking?tracking_id=TEST-AUDIT-4` and `?tracking_id=<x>` | Shows "Tracking number received … isn't connected" and "doesn't look right" |
| E2E tracking journeys | `E2E_PORT=3000 npx playwright test tests/e2e/journeys.spec.ts -g tracking --workers=1 --timeout=120000` | **6/6 passed** (desktop, tablet, mobile) |
| E2E `/tracking` page health and overflow | `E2E_PORT=3000 npx playwright test tests/e2e/pages.spec.ts -g /tracking --workers=1 --timeout=120000` | **3/3 passed** (no horizontal overflow, broken images or console errors) |

### Notes on the runs

- The local checks used the project's own `next dev` server, which was already running on port 3000. `npm run build` was not run.
- Playwright is set up to test a production build (`playwright.config.ts:23-29`). These end-to-end tests ran against the dev server instead.
- A first parallel run had 4 timeouts (desktop and tablet). The page was waiting on the shared dev server, not failing an assertion. They passed when re-run one at a time with a longer timeout.

### Not tested

- The `found` and `not_found` display.
- Any IMD call, 403 handling, or timeout handling. None of these exists in the code, and a live end-to-end test is **blocked** until IMD supplies an approved test AWB and authorization.

## 10. Exact Steps to Make Live Tracking Work

### Local development

1. Get the section 7 answers from IMD, including an approved test AWB.
2. Fix `.gitignore` so `.env.example` is tracked (`!.env.example`). Add the final variable names to `.env.example` with **empty** values.
3. Create `.env.local` with:
   - `NEXT_PUBLIC_SITE_URL=https://www.meemcontinental.com` (keep it)
   - `TRACKING_API_URL`
   - the customer-code variable
   - the company-ID variable
   - `TRACKING_API_KEY`, only if IMD issues one
4. In `lib/tracking.ts`, implement an IMD `TrackingProvider`:
   - It runs on the server only (consider `import "server-only"`).
   - It reads the env vars and returns `null` if any is missing, so the site keeps showing `not_connected`.
   - It builds the request in the format IMD confirms.
   - It uses `fetch(..., { cache: "no-store", signal: AbortSignal.timeout(8000) })`.
   - It sends a clear `User-Agent`.
5. Parse the reply:
   - Read the body even when the status is 200.
   - Treat `errors: true` or an empty array as an error, and map IMD's not-found case to `not_found`.
   - Map the delivered and in-transit samples to `found`, with events in ISO-8601 time and the time zone made explicit.
6. Add a `{ status: "unavailable" }` variant to `TrackingResult`, and a message for it in `TrackingStatus.tsx`. Map 403, other 4xx/5xx, timeouts, network errors and replies that can't be parsed to it.
   - Log only the status code and a reason.
   - **Never log the request URL** (it contains the customer code), the customer's tracking number in full, or response bodies (they contain personal data).
7. Apply the same per-IP rate limit used in `preflight` to the `/tracking` page lookup. Consider a short in-memory cache of results per tracking number.
8. Add `useTransition`, a disabled button and a "Checking…" label to `TrackingForm`.
9. Add tests: unit tests of the parser using IMD's sanitized sample JSON (found, not found, `errors: true`, 403, timeout via a mocked `fetch`), plus a render test for `found`.
10. Run one local test against IMD with the **approved test AWB only**. If IMD only accepts approved IPs, the developer machine's IP must be approved first, or this step is skipped and testing is done from the production server.

### Production hosting

1. Choose and confirm the host. Find its **fixed outgoing IP address** and send it to IMD for allowlisting.
   - Serverless hosts (for example Vercel) do not have a fixed outgoing IP by default. They need a static-IP add-on or a proxy.
   - A VPS running `next start` behind nginx has a fixed IP.
2. Set the server-only env vars in the host's settings. Keep `NEXT_PUBLIC_SITE_URL=https://www.meemcontinental.com`.
3. Make sure a proxy in front of the app overwrites `X-Forwarded-For`, so the rate limiter can trust it (`lib/server/rate-limit.ts:33-37`).
4. Deploy. Test with the approved test AWB. Check the delivered, in-transit and not-found displays against IMD's samples.
5. Monitor for 403s and 429s from IMD in the server logs, logging the status only.

## 11. Risks & Open Questions

- **IP allowlisting:** if IMD only accepts approved IPs, a serverless host could fail with a 403 just like the old site. Decide the hosting before going live.
- **Customer code in the URL:** if IMD requires it as a query parameter, it will appear in IMD's and Cloudflare's logs. MCL's own logs and error trackers must never record the outgoing URL.
- **No rate limit on the `/tracking` page:** once IMD is connected, this page becomes an open relay to IMD. Fix this before going live.
- **The rate limit is per instance and in memory:** it is weak on hosts that run several instances at once.
- **Errors arrive as a 200 with a `text/html` content type:** the parser must not rely on the status code or `Content-Type`.
- **Two paths reach `trackShipment()`:** the `/tracking` page and `/api/tracking`. Both need the same limits and error mapping.
- **Time zones:** event times are rendered on the server, which may be in UTC.
- **Personal data:** responses may include recipient details. Show only what customers need, and do not log responses.
- **Open questions:**
  - Did the old site ever store tracking records locally, and is anything still needed from that database?
  - Can one AWB have more than one shipment in IMD's reply?
  - Should tracking also accept MCL's own booking reference, or only IMD's AWB?
  - Do the FAQ and blog claims of "real-time tracking" (`README.md:118`) need softening until this goes live?

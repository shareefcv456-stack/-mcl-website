# MCL — IMD Courier tracking: search & env report

Date: 2026-11-02. Project: `mcl-next` (Next.js). No commit, push or deploy. No application code changed.

## 1. Files and folders searched

- Project root: `.env*`, `.gitignore`, `README.md`, `next.config.ts`
- `app/` — including `app/api/tracking/route.ts`, `app/tracking/page.tsx`, `app/sitemap.ts`
- `components/` — including `components/tracking/TrackingForm.tsx`, `components/tracking/TrackingStatus.tsx`
- `lib/` — `lib/tracking.ts`, `lib/server/` (`forms.ts`, `mail.ts`, `rate-limit.ts`), `lib/validation/forms.ts`, `lib/content/site.ts`
- `tests/`, `scripts/`
- Earlier reports: `API_INTEGRATION_REPORT.md`, `TRACKING_STATUS_REPORT.md`
- Search terms: `track`, `imd`, `imdcourier`, `tracking_api`, `company_id`, `customer_code`, `IMD_`, `process.env` (excluding `node_modules`, `.next`, `.git`)

## 2. Existing tracking implementation

| Piece | File | State |
|---|---|---|
| Form (GET `/tracking?tracking_id=…`) | `components/tracking/TrackingForm.tsx` | Working; validates with `trackingIdSchema` |
| Page | `app/tracking/page.tsx:30` | Calls `trackShipment()` server-side, renders `TrackingStatus` |
| JSON API | `app/api/tracking/route.ts` | `GET /api/tracking?tracking_id=…`, rate-limited via `preflight()`, returns `trackShipment()` |
| Provider hook | `lib/tracking.ts` | `TrackingProvider` interface + `getTrackingProvider()` which **returns `null`** → every lookup is `not_connected` |
| IMD request code | — | **None.** No `fetch`, no IMD URL, no `process.env` read for tracking anywhere |

Reuse: the integration belongs in `lib/tracking.ts` (implement `TrackingProvider`, return it from `getTrackingProvider()`). Route, page, form and UI need no change.

## 3. Environment file identified

- `.env.local`: **did not exist** → created (gitignored by `.gitignore:34` `.env*`). Holds the real server values.
- `.env.example`: existing template → IMD names appended; existing lines untouched.
- Note: `.env.example` is also matched by `.env*`, so it is not in git. Add `!.env.example` to `.gitignore` if it should be committed.

## 4. Variables

| Variable | Before | Now (`.env.local`) | Read by code? |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | In `.env.example` only | `https://www.meemcontinental.com` | Yes, `lib/content/site.ts:7` (public URL only, not a secret) |
| `IMD_TRACKING_API_URL` | Missing | IMD endpoint | Not yet |
| `IMD_TRACKING_API_COMPANY_ID` | Missing | `15` (unconfirmed as correct for MCL) | Not yet |
| `IMD_TRACKING_CUSTOMER_CODE` | Missing | **Empty** — placeholder deliberately not used | Not yet |

- No IMD value uses a `NEXT_PUBLIC_` prefix, so none can reach the browser bundle.
- Old reserved names `TRACKING_API_URL` / `TRACKING_API_KEY` remain commented in `.env.example` and are referenced in `lib/tracking.ts:5` and `README.md:88`. Swap them for the `IMD_*` names when the provider is written.

## 5. What is still unverified (blocks the code)

From `API_INTEGRATION_REPORT.md` and `TRACKING_STATUS_REPORT.md`; no API documentation is in the project:

- **Method / format:** the old Django site reportedly used `GET` with query params `api_company_id`, `customer_code`, `tracking_no` (user-supplied evidence, not confirmed). Probes show GET/POST/OPTIONS all return HTTP 200 with `[{"errors":true,"tracking_no":"Customer Code required"}]` — so HTTP 200 ≠ success.
- Whether the customer code alone authenticates, or a key/token is also needed.
- Whether company ID `15` is correct.
- Server IP allowlisting (the old server got HTTP 403).
- Response schema for found / in-transit / delivered / not-found, date format and time zone.

## 6. Next steps

1. Get from MCL/IMD: the real customer code, API docs or a sanitized working request, example responses, and an approved test tracking number.
2. Put the customer code in `.env.local` (local) and in the hosting provider's env settings (production) as `IMD_TRACKING_CUSTOMER_CODE`. Never in chat, git or a `NEXT_PUBLIC_` variable.
3. In `lib/tracking.ts`, implement an IMD `TrackingProvider`:
   - read the three `IMD_TRACKING_*` vars; return `null` from `getTrackingProvider()` if any is empty (keeps today's `not_connected` behaviour);
   - send the request in the format IMD confirms, with a timeout;
   - parse the body as JSON regardless of `Content-Type` (IMD sends `text/html`), treat `errors: true` as failure, map to `not_found` / `found` with `TrackingEvent[]`;
   - never log or return the customer code.
4. Add a rate limit to the `/tracking` page path (it calls `trackShipment()` directly and currently has none — see `TRACKING_STATUS_REPORT.md`).
5. Update `lib/tracking.ts:5` comment and `README.md:88` to the `IMD_*` names; remove the reserved `TRACKING_API_*` lines from `.env.example`.
6. Add a unit test in `tests/unit/` with a mocked IMD response, then test once with the approved tracking number.

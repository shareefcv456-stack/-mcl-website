# MCL Website — Next.js

This is the production rebuild of the MCL (Meem Continental Logistics) website redesign. It replaced the static HTML prototype that used to sit in the parent folder and is now the single source of truth for the site.

Stack: **Next.js 16.4** (App Router, Turbopack, Cache Components), **React 19**, **TypeScript**, **Tailwind CSS 4**, **React Hook Form + Zod**, **lucide-react**. Tests use **Vitest + React Testing Library** and **Playwright**.

## Run it

Requires Node.js 20.9 or later and Google Chrome (the end-to-end tests use the installed Chrome).

```sh
cd "Mcl-webiste /mcl-next"   # the parent folder name ends with a space
npm install
cp .env.example .env.local    # optional; the defaults work locally

npm run dev                   # http://localhost:3000
npm run build && npm start    # production build
```

### Checks

```sh
npm run typecheck   # next typegen + tsc
npm run lint        # ESLint (next/core-web-vitals + typescript)
npm test            # Vitest unit + component tests
npm run build
npm run test:e2e    # Playwright: desktop, tablet, mobile. Needs a build. Starts `next start -p 3100`, or reuses one already on that port.
npm run check       # typecheck + lint + unit tests + build
```

> **npm 10.8 note:** `npm install` of new packages can crash with `Cannot read properties of null (reading 'edgesOut')`. This is an npm bug. Use `npx npm@11 install <pkg>` for that one install. A plain `npm install` from the lockfile works.

## Routes

All original URLs are kept. Next.js normalises trailing slashes, so old links like `/about/` redirect permanently (308) to `/about`.

| Route | Page | Rendering |
|---|---|---|
| `/` | Home: hero → about → services → 12 categories → process → why us → calculator → portfolio → testimonials → FAQ → blogs | Static |
| `/about` | About | Static |
| `/tracking` (`?tracking_id=…`) | Tracking. Same GET contract as the live form | Static shell + request-time lookup |
| `/services`, `/service/{air-freight-services, ocean-freight, lakshadweep-special-shipments, land-transportation}` | Services + 4 details | Static |
| `/blogs`, `/blog/detail/{3 slugs}` | Blog + 3 articles | Static |
| `/career`, `/career/detail/python-develper` | Careers + job (with Apply form) | Static |
| `/review` | Reviews + review form | Static |
| `/contact` | Contact + Support (FAQ, offices, form) | Static |
| `/privacy-policy`, `/terms-of-service`, `/refund-policy`, `/shipping-policy` | Legal | Static |
| `/design-system` | Tokens + components (noindex, not linked) | Static |
| `/support` → `/contact`, `/reviews` → `/review` | Permanent redirects. The live site has no separate Support or Reviews URL; its "Support" nav item already went to `/contact`. | — |

Unknown slugs return a real **404** (`ensureStatic = "navigation"` on the dynamic routes).

## Structure

```
app/                     routes (server components) + api/ route handlers, sitemap.ts, robots.ts
components/
  layout/                Header (nav + mobile drawer), Footer, PageBanner, SupportBand, Aside, LegalPage
  home/                  Hero + homepage sections (several reused on About/Reviews/Contact)
  quote/                 QuoteProvider (dialog + context), QuoteTrigger
  forms/                 ContactForm, ReviewForm, ApplyForm, NewsletterForm, useFormSubmit
  tracking/ calculator/ services/ blogs/ ui/
lib/
  content/               all page copy as typed data (copied from meemcontinental.com)
  validation/forms.ts    Zod schemas shared by client forms and API routes
  calculator.ts          volumetric weight (L × W × H ÷ 5000)
  tracking.ts            TrackingProvider interface (no provider connected)
  server/                form pipeline, rate limiter, mail provider interface
types/content.ts         content models
tests/unit, tests/e2e
```

Only interactive pieces are client components: header/drawer, quote dialog, forms, tracking form and calculator. Everything else renders on the server and is prerendered at build time.

## How the interactive parts behave

- **Get a Quote** opens an accessible native `<dialog>`. It traps focus, makes the page behind it inert, closes on Escape or a backdrop click, and returns focus to the trigger. Category tiles and sub-service cards prefill the subject, e.g. "Quote: Medicine and Pharma". Without JavaScript the trigger links to `/contact`.
- **Forms** (contact, quote, review, job application with CV, newsletter) are validated on the client with React Hook Form + Zod, and again on the server with the same schemas. API pipeline: rate limit (5/min per IP per form) → declared-size check → content type → body size (16 KB JSON, 5 MB CV) → honeypot (`form_botcheck`, the live site's field name) → validation → delivery.
- **Email delivery is not connected.** No provider has been approved, so the APIs respond `503 DELIVERY_NOT_CONFIGURED`. The UI says **"Not sent — online delivery isn't set up yet"** and gives the phone and email. Success is shown only when a provider accepts the message.
- **Tracking** validates the number (letters, digits, hyphens, 3–100 characters). With no provider connected it shows **"Live shipment status isn't connected"**, never invented results. The JSON endpoint is `GET /api/tracking?tracking_id=…`.
- **Volume calculator**: L × W × H ÷ 5000 (cm → kg), shown with `toFixed(2)`, the same as the live site. 50 × 40 × 30 = 12.00 kg. It takes positive decimals only and shows an inline message for each invalid field.

## Connecting real services (needs credentials)

| Integration | Where | Env vars (server-only) |
|---|---|---|
| Email for all forms | Implement `MailProvider` in `lib/server/mail.ts` and return it from `getMailProvider()` | `MAIL_PROVIDER`, `MAIL_API_KEY`, `MAIL_FROM`, `MAIL_TO` (names reserved in `.env.example`) |
| Shipment tracking | Implement `TrackingProvider` in `lib/tracking.ts` and return it from `getTrackingProvider()` | `TRACKING_API_URL`, `TRACKING_API_KEY` |

Neither has a fake implementation. Until they are wired up, the site says plainly that they are not connected.

## Security and production notes

- Headers on every response: CSP (no third-party origins, `frame-ancestors 'none'`), HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy. `X-Powered-By` is off. The CSP allows `'unsafe-inline'` scripts because Next's bootstrap is inline. A nonce-based CSP would make every page render per request.
- The rate limiter is in memory, per instance, and keyed on `X-Forwarded-For`. **Deploy behind a proxy or platform that overwrites that header** (Vercel, nginx, Cloudflare). Use a shared store such as Redis if you run several instances.
- API errors never include stack traces or visitor data. Delivery failures log only the error message.
- SEO: per-page titles and descriptions, canonical URLs, Open Graph, `sitemap.xml`, `robots.txt` (disallows `/api/` and `/design-system`). Images go through `next/image` (lazy below the fold; the hero is preloaded). Fonts are self-hosted with `next/font`.

## Decisions taken in the migration

- **No animation library.** The brief listed Framer Motion as optional. The design needs only hover lifts, a drawer slide-in and an accordion rotate, all done with CSS transitions and turned off under `prefers-reduced-motion`. Adding one later is a single install.
- **`@hookform/resolvers` v5, not v6.** v6 has an optional `effect` peer that conflicts during npm resolution. v5.9 supports Zod 4.
- **Vitest 4, not 5.** Vitest 5 requires `@types/node` 22+, and this project targets Node 20.
- **Phone validation** was added: digits, spaces, `+ - ( )`, at least 6 characters. The live form only required the field. **CV uploads** are limited to PDF/DOC/DOCX up to 5 MB. The live form accepted any file.

## Unresolved content decisions (need MCL confirmation)

Carried over from the static prototype's README and still open. The content was kept as published, not silently corrected.

1. **Kochi address conflict.** The live header shows *Mezkar Arcade, Aluva – 683101, +91 9895258623*. The footer and contact page show *Sakthi Enclave, Elamakkara PO – 682026, +91 9249551711*. This build uses Sakthi Enclave (2 of 3 sources). See `lib/content/site.ts`.
2. **Job URL and content.** "Logistics Manager" lives at `/career/detail/python-develper`. Its last three requirements describe software-development work. Kept verbatim; the URL is preserved.
3. **Terms of Service** contains the unfilled placeholder "governed by the laws of **Jurisdiction**". Kept verbatim.
4. **Carrier logos** (FedEx, DHL, Aramex, UPS, DPD) on the live homepage are **not shown** until MCL confirms those relationships.
5. The Careers page heading on the live site reads "Contact Us". It is shown here as "Careers".
6. The job sidebar's "aviation support" template text is omitted.
7. The Shipping Policy's misplaced refund clause was dropped from "Order Processing Time". "Europen" was corrected to "European".
8. The FAQ refers to "our list of prohibited items", which does not exist on the site.
9. The FAQ and blogs mention real-time tracking and an online booking platform. Neither exists yet.
10. "Over 150 countries" and "partnering with major airlines" are published claims, kept as is.
11. The copyright line credits only Gedexo Technologies.
12. The live footer has two social icons linking to `#`. They are omitted; Instagram, WhatsApp and phone are kept.
13. Minor copy fixes, meaning unchanged: "Pharama" → "Pharma", "nce" → "Once", plus punctuation and spacing.

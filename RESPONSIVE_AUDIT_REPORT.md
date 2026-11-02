# MCL Website — Responsive Audit Report

Date: 2026-10-30 · Scope: every public page, all shared components, 13 viewport widths · Nothing committed, pushed or deployed.

## Summary

The reported "large blank white space between the Hero and Our Services" is **not a layout gap**. The section there
(About MCL, `AboutIntro`) is 1,098 px of real content: picture, heading, text and two benefits. Its content is hidden until it scrolls into view, then fades
in (`components/ui/Reveal.tsx`). Any capture that doesn't scroll the page the normal way, such as Chrome DevTools
"Capture full size screenshot" (where Pixel 9 Pro Fold is a device preset) or a phone's scrolling screenshot, records
that section, and every revealed section after it, as blank.

The measured layout had no blank bands at all: no `100vh` misuse, no spacer elements and no stray padding.
The audit did find six other genuine issues (two items cut off on small phones, a flicker bug, low contrast and small
tap targets), all fixed below.

## Issues identified, root causes and fixes

| # | Issue | Where | Root cause | Fix |
|---|---|---|---|---|
| 1 | "Blank space" after the Hero in full-page and scrolling screenshots, and a brief white flash on fast flicks | Home → About MCL (and every scroll-revealed section) | Scroll reveal hides content until it enters the screen; screenshot tools capture before it does | Not a layout bug; layout left as is (see *Remaining issues* for the option of showing content immediately) |
| 2 | "About Company" link flickers on and off at the bottom of the screen | Home → About MCL | The replay observer hid the element as soon as it was off screen; its own 16 px fade-up pushed it off screen again, in a loop | `Reveal.tsx`: 48 px margin on the replay observer (larger than any entrance movement), so the loop can't start |
| 3 | Volume Conversion and Benefits FAQ cut off by 3 px on the right at 320 px | Home | The two columns share an unsized single-column grid. The non-wrapping "Still have questions? Contact us" button (307 px) widened that column past the 288 px available, and the page edge clipped the overflow silently, so there was no scrollbar | `grid-cols-1` caps the column at the container width; that button may wrap to two lines on the narrowest phones |
| 4 | "Call support" / "Email us" cards cut off by 16 px at 320 px | `/tracking` | Same unsized grid column, widened by the full email address | `grid-cols-1`; the email now truncates inside its card, as it already did on `/contact` |
| 5 | Hero intro paragraph hard to read over the bright containers (contrast down to about 2.9:1 at 320 px) | Home Hero, phones | The mobile overlay was lightest (40 %) exactly where the paragraph sits | Darker middle band on the mobile overlay only (desktop unchanged). Now above 5:1 over 95 % of the area at 320–412 px |
| 6 | Tap targets under 24 px (WCAG 2.5.8) | Footer links on every page, page-banner breadcrumbs, office phone numbers on `/contact` | 13–15 px text links with no padding (16–19 px tall) | `py-1` plus `-my-1`: 8 px taller tap areas with no layout movement; neighbouring tap areas don't overlap |

Checked and found correct (no change needed):
- **Mobile navigation:** the menu button is 44×44, the menu opens with all links, Escape closes it, and tapping a link navigates and closes the menu (320, 412, 791 px).
- **Fixed header:** never covers the page heading on load (0 of 273 checks).
- **Hero:** heading, subtitle, buttons (stacked at 320 px), statistic and the tracking card all fit and stay tappable at every width.
- **Our Services:** the route scene sits between the heading and the cards below 1025 px. The plane and ship move on all widths, cards are 1, 2 or 4 columns.
- **Shipment Categories:** the ship and routes are visible on mobile. Cards are 2, 3 or 4 columns, with even proportions.
- **Volume calculator:** the formula, validation and Reset are unchanged.
- **Overflow and errors:** no horizontal scrolling or console errors on any page at any width.

## Files modified

- `components/ui/Reveal.tsx`: replay observer margin (issue 2)
- `components/home/Hero.tsx`: mobile overlay (issue 5)
- `components/home/Sections.tsx`: Volume/FAQ grid and button wrapping (issue 3)
- `app/tracking/page.tsx`: contact card grid (issue 4)
- `components/layout/Footer.tsx`: tap targets (issue 6)
- `components/layout/PageBanner.tsx`: breadcrumb tap targets (issue 6)
- `app/contact/page.tsx`: office phone tap targets (issue 6)

No dependencies added; no content, routes or assets changed.

## Viewports tested

The 21 routes in `tests/e2e/routes.ts` were each loaded in Chrome at 13 widths: 273 page loads per run.

| Width | Device |
|---|---|
| 320 | Small phone |
| 360, 375, 390 | Standard phones (375 is iPhone SE size) |
| **412 × 924** | **Pixel 9 Pro Fold, outer screen** |
| 430 | Large phone |
| 540 | Foldable / compact tablet |
| 768 | Tablet |
| **791 × 820** | **Pixel 9 Pro Fold, inner screen** |
| 1024, 1280, 1440, 1920 | Laptop and desktop |

Each check:
1. Horizontal overflow.
2. Elements past the screen edge that are not clipped on purpose.
3. Content cut off by the page-level clip.
4. Text overflowing its box.
5. Tap targets under 24 px.
6. Header over the `h1`.
7. Blank bands of uniform colour of 260 px or more in a full-page capture, taken with reduced motion so the reveal can't fake a blank.
8. Console errors.

Full-page screenshots were inspected at 320, 412, 791 and 1440 px.

| Check | Before | After |
|---|---|---|
| Horizontal overflow | 0 | 0 |
| Content cut off at the screen edge | 2 places (320 px) | 0 |
| Text overflow / header over `h1` / console errors | 0 | 0 |
| Blank bands (with reduced motion) | 0 | 0 |
| Tap targets under 24 px | 5,395 instances | 117, all links inside sentences (exempt under WCAG 2.5.8) |
| Hero paragraph contrast, worst 5 % of area at 320 px | 2.86 : 1 | 5.16 : 1 |

The final run used a production build (`next start`), except a re-check of `/contact` after its last fix, which used
the dev server.

## Build and lint results

- `tsc --noEmit`: pass
- `eslint`: pass
- `vitest`: 47 / 47 tests pass
- `npm run build`: pass (compiled successfully; re-run after the last change)

## Remaining issues

1. **Scroll reveal and screenshots (issue 1).** It is a design choice, not a bug: content fades in as it arrives.
   - **Effect:** full-page and scrolling screenshots will always show unrevealed sections as blank, and a very fast flick briefly shows white before content fades in.
   - **Option:** if that matters more than the entrance effect, `Reveal.tsx` can be changed so content is never hidden (shown immediately, with only a subtle movement). It is a one-file change, but it changes the motion of the whole site, so it was not made without your approval.
2. **Floating buttons.** The WhatsApp button (and the Next.js "N" indicator, which shows in development only) floats over page content. At 320 px it sits over the Hero paragraph on first load. This is standard for floating buttons and was left unchanged.
3. **Image rights for the Grocery card.** The original file looks like a stock web banner; please confirm MCL has
   the rights to use it.

## Follow-up fixes (2026-10-31)

- **Grocery and Stationery card**
  - **Problem:** `cat/grocery.png` was a web banner with a fake "transparent" checkerboard baked in, plus another
    company's ad text ("Grocery Items at your door step", "Free Home Delivery *").
  - **Fix:** a cleaned copy, `public/images/cat/grocery.webp` (540 × 374, 57 KB). It is cropped to the products, which
    drops the text, and the grey checker squares (exactly #E6E6E6) are turned white. It is padded to the cards' shape.
  - **Files:** `lib/content/home.ts` now points to it. The original PNG is left in place, unused.
- **What We Ship route pins on phones**
  - **Problem:** the ship scene is scaled down on phones, so its pins were about 9 px.
  - **Fix:** below 641 px each pin is enlarged about its tip (`.route-pin` in `app/globals.css`, groups added in
    `components/home/Sections.tsx`). Pins now measure 14–16 px at 360–390 px, the same as desktop (16 px). Tablet
    (15 px) and desktop are unchanged.
- The quote action on the Grocery card still opens pre-filled: "Quote: Grocery and Stationery".

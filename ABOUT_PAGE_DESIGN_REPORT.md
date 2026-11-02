# MCL About Page — Design Report

Date: 2026-10-31 · Route: `/about` · Nothing committed, pushed or deployed. No dependencies added.

## Existing issues found

- The page was a standard navy banner, one text and image block, a row of five icon-only value cards and a reused copy
  of the Home page's Our Services route animation. It had no identity of its own.
- The values had titles but no descriptions.
- **MCL has no published vision statement and no dated company history.** The site has no milestones, founding year or
  timeline anywhere, so none were invented (see *Content decisions*).
- **No video footage exists in the project.** `HERO_VIDEO` in `lib/content/home.ts` is empty, and no port-crane
  photograph exists either.
- **No reference images were attached** to the request, so the design follows the written direction only.

## Components

New: `components/about/AboutSections.tsx`
- `AboutHero`
- `CompanyOverview`
- `MissionVision`
- `Journey`
- `ValuesSection`
- `NetworkSection` (with `PortMap`)

Modified:
- `app/about/page.tsx`: now composes the sections above, followed by the existing `WhyChooseUs` and `SupportBand`.
  The metadata is unchanged.
- `lib/content/home.ts`: each of the five `VALUES` gained a one-line `text`.
- `components/home/RouteArt.tsx`: new `TruckArt`, a top-down truck in the same style as the plane and ship.
- `components/home/Sections.tsx`: `RouteLines`, `Route` and `Mover` are now exported for reuse. Their behaviour is
  unchanged, and so is the Home page.
- `app/globals.css`: new keyframes `plane-cross`, `net-draw` and `journey-fill`, and the rules `.about-plane`,
  `.net-draw`, `.net-node` and `.journey-fill`. All of them are inside the existing `prefers-reduced-motion:
  no-preference` block.

Unchanged: the Header and navigation, the Home page, brand tokens, links and the quote flow.

## Design

Section order: Hero (dark) → Overview (white) → Mission and Vision (navy photo) → Journey (white) → Values (ice-blue)
→ Network (white) → Why Choose Us (ice-blue) → Support band. Backgrounds alternate, so no two neighbouring sections
share a colour.

Colours: the existing brand tokens (navy `#0b1533` and MCL blue `#2c35d4`) are kept so the brand doesn't change. The
requested sky blue `#55B8F2` is the About page accent, used in icon gradients, nodes, the timeline line and the hero
rule. The requested navy `#071B3A` is the hero and overlay tint.

1. **Hero.** Full width at `max(640px, 92svh)`, on the large container-ship photo `about-ship.jpg`.
   - Text: H1 "Moving the World Together.", the requested supporting copy, Get a Quote (opens the quote dialog), Our
     Services, and the original lead line.
   - The breadcrumb (Home / About Us) is kept.
2. **Company overview.**
   - Layout: an editorial text column (the original "Who we are" paragraph and Benefits) beside the existing photo
     with the "1000+ Delivered Goods" badge, which counts up.
   - Statistic strip with four counters, all facts the site already states:
     - 1000+ Delivered Goods.
     - 150+ countries, from the Air Cargo page ("delivery to over 150 countries").
     - 3 modes: land, sea and air.
     - 12 shipment categories, counted from the category list.
3. **Mission and Vision.** Two glass panels with gradient icon tiles over a dimmed aerial ship photo (`work1-2.jpg`).
   - On hover, a panel lifts, its border turns sky blue and a corner glow brightens.
4. **Journey.** A connected vertical timeline.
   - Desktop: cards alternate left and right and overlap so the line reads as one path.
   - Mobile: one column with the line on the left.
5. **Values.** Five cards: Reliability, Professionalism, Customer Satisfaction, Innovation and Integrity.
   - Each card has a raised gradient icon tile, a number, and a description taken from MCL's own copy.
   - Background: a faint dotted constellation of nodes and links, which is not a route animation.
   - Layout: 5 across from 1280 px, 3 + 2 from 861 px, 2 + 2 + 1 from 540 px, and 1 column below that.
6. **Logistics network.** A new top-down port map: open sea, coastline, a quay with three cranes, a container yard, a
   road inland and town blocks.
   - The ship sails in to the quay, the airliner flies its own route overhead, and a truck leaves the port, each at a
     different speed.
   - Below the map are four linked cards: Air Freight, Sea Freight, Land Transport (each linking to its service page)
     and Global Network (linking to `/services`).

## Animation

All animation is CSS transform, opacity or stroke, or the existing SVG motion. Each layer is wrapped in `PauseOffscreen`,
so it stops while off screen. With reduced motion, everything is still and fully visible.

| Element | Motion |
|---|---|
| Hero headline | Words rise in turn (reuses `.hero-word`) |
| Hero sky | The photo's own clouds (`sky-clouds.webp`) drift slowly |
| Hero sea | Two ripple layers slide at different speeds, plus a passing glint (reuses the Home hero effects) |
| Hero aircraft | A distant airliner silhouette with a contrail crosses the sky every 60 s, climbing slightly. It is independent of everything else. |
| Hero air links | Three arcs in the sky draw in one after another; their nodes send out a soft ring |
| Overview | Image wipe reveal; the counters count up on entry |
| Cards | Staggered entrances (`Reveal`); the Values cards tilt toward the pointer (mouse only); hover lift on every card |
| Journey | The line fills from the top as the steps scroll past (scroll-driven `view-timeline`; the line is full where unsupported) |
| Mission and Vision | The background photo drifts a few pixels against the scroll |
| Network map | Fades in once. The ship (with wake and gentle sway), plane and truck travel their routes, the travelled stretch lights up, the destination pin pulses and swell lines drift. With reduced motion, the vehicles are parked mid-route. |

## Assets

- **New assets: none.** Every image is an existing project file, served through `next/image`, which delivers it as
  WebP or AVIF:
  - `about-ship.jpg` for the hero, preloaded because it is the largest element on first load.
  - `sky-clouds.webp`, `hero-sea-shimmer.jpg`, `5.jpg` and `work1-2.jpg`.
- **Illustrations:** the aircraft silhouette, air links, port map, cranes, yard and `TruckArt` are inline SVG drawn in
  code.
- **No video.** The hero is a still photo with real moving layers on top, and it does not pretend to be footage.
  - The ship itself does not move: that needs a licensed clip, or the Runway clip once it is approved and generated.
  - Wiring footage in would reuse the existing `HeroVideo` component, with the photo as poster and fallback.

## Content decisions

- **Vision card:** MCL has no published vision statement. The card uses MCL's own sentence from the original About copy
  ("At MCL, we believe in building long-lasting relationships…"). Please supply a vision statement if you have one.
- **Mission card:** the original sentence, word for word.
- **Timeline:** there are no dated milestones, so it follows a shipment through MCL's six published working steps (the
  same steps as the Home page's Working Process). It shows no dates. Replace it with real milestones if you supply them.
- **Values descriptions:** each one restates existing copy from About, Why Choose Us or Benefits. There are no new
  claims.
- **Hero copy:** the supporting text is the copy you supplied. It includes the word "sustainable", which appears nowhere
  else on the site.
- **Nothing removed:** every piece of previous About content is still on the page:
  - both paragraphs (the second is now split into the Mission and Vision cards);
  - Benefits and the delivered-goods photo;
  - Values, Why Choose Us and the Support band.

## Responsive and functional tests

Tested in Chrome against the dev server. Screenshots are in
`/private/tmp/claude-501/-Users-muhammedshareefcv-Desktop-Mcl-webiste-/f3b9de83-f7ce-4c47-b4c4-23c57f4a241d/scratchpad/about/`
(`hero-1440.png`, `hero-390.png`, and `s1`–`s7` at 1440 and 390).

| Check | Result |
|---|---|
| Horizontal overflow at 320, 390, 768 and 1440 px | 0 |
| Console or page errors | none |
| Counters reach their final values (1000+, 150+, 3, 12) | yes, at all four widths |
| Hero aircraft moves | yes |
| Internal links (`/`, `/contact`, `/services` and the three service pages) | all return 200 |
| Hero "Get a Quote" | opens the quote dialog |
| Reduced motion | aircraft and air links still, no hidden content, network vehicles parked |

- **Mobile composition:**
  - The hero overlay is light at the top, so the ship and plane show above the text, and dark under the copy.
  - The air-link graphic is hidden below 641 px to keep the hero light.
  - The map uses a 16:10 crop centred on the port.
  - Cards stack, and the timeline runs down a left-hand line.

## Build and lint

- `tsc --noEmit`: pass
- `eslint .`: pass
- `vitest`: 47 / 47 pass
- `npm run build`: pass (compiled successfully)

## Remaining issues

1. **Real hero video** needs a licensed clip, or the Runway generation, which is waiting on your API key and approval.
2. **Vision statement and company milestones:** please supply them if they exist (see *Content decisions*).
3. **Port and crane photography:** none exists in the project, so the port appears only in the illustrated map.
4. **Screenshot timing:** element screenshots taken while a counter is restarting show "0+". This is the counter
   replaying on entry, not a bug; in normal scrolling every counter finishes on its final value.

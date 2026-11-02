# MCL About Page — Our Values Section Redesign

Date: 2026-10-31 · Scope: the Our Values section of `/about` only · Nothing committed, pushed or deployed. No
dependencies added.

## What changed

The section is `ValuesSection` in `components/about/AboutSections.tsx`. The screenshot mentioned in the request was not
attached, so the work started from the section as it was in the code: a faint dotted node network behind five white
cards. The Home page's plane-and-ship route had already been removed from this section in the previous round.

**New composition, a "global logistics world":**
1. **Atmosphere:** a soft sky-blue sky fading to white at the bottom, where it meets the next section. The section's
   background is no longer plain white.
2. **Clouds:** two cloud banks made from real cloud photography, at different depths.
3. **Globe and network:** a large wireframe globe, centred and rising out of the sea horizon behind the heading.
   - Air links run across its face, between glowing nodes.
   - The network keeps to the globe's sides and to the band below the subtitle, so it never crosses the heading.
4. **Port:** distant port silhouettes on the horizon at either side: ship-to-shore cranes, container stacks and a
   berthed ship.
5. **Sea:** the ocean runs from the horizon down behind the cards. It is paled by a gradient, not a blur or fog, so the
   cards stay readable.
6. **Heading:** eyebrow "What drives us", the "Our Values" heading, and the new subtitle "The principles that move us
   forward."
7. **Card links:** on wide screens, where all five cards sit in one row, thin lines fan out from one point under the
   heading to each card, with points of light travelling down them.
8. **Glass cards:**
   - Translucent white-to-ice-blue gradient, white border, inner highlight and soft shadow.
   - Raised gradient icon tiles with a gloss highlight.
   - On hover, a card lifts, tilts toward the pointer, gains a sky-blue border, ring and corner glow, and its icon
     floats up and turns slightly.

**Kept:** all five values, their names and their descriptions, word for word. Nothing else on the page was changed.

## Background assets

- **New image files: none.** The section reuses existing optimised files:
  - `public/images/sky-clouds.webp`
  - `public/images/ocean-texture.jpg` (served through `next/image`, so it arrives as WebP or AVIF)
  - `public/images/hero-sea-shimmer.jpg`
- **Drawn as inline SVG in code:** the globe, network, port silhouettes and card links.
- **No Three.js or Framer Motion:** neither is installed, and CSS and SVG achieve the result at a fraction of the cost.

## Animation

| Layer | Motion | How |
|---|---|---|
| Sky light | A large soft highlight slowly brightens and dims (18 s) | CSS opacity |
| Clouds | Near bank drifts 70 s, far bank 110 s in the opposite direction | CSS transform |
| Globe | Meridians sweep from limb to limb, out of step, so the globe reads as turning (36 s) | SVG `animate` |
| Network | Links draw in one after another, nodes send out soft rings, points of light travel four of the links | CSS stroke-dashoffset, SVG `animateMotion` |
| Card links | Lines draw in, then lights run down each one in turn | Same as the network |
| Sea | A ripple layer slides across the water | CSS transform |
| Parallax | Clouds, globe and port drift by different amounts against the scroll (36, 22 and 8 px) | Scroll-driven `animation-timeline: view()` (existing `.scroll-depth`) |
| Cards | Staggered entrance, pointer tilt, hover lift and glow, icon float | Existing `Reveal` and `Tilt`, plus CSS |

**Performance:**
- Everything is transform, opacity or stroke work.
- The backdrop and the card links pause while off screen (`PauseOffscreen`).

**Reduced motion:** every animation is off and nothing is hidden. The globe shows four static meridians in place of
the moving ones. This was verified in Chrome.

**Phones, the lightweight fallback (below 641 px):**
- The far cloud bank, port silhouettes and card links are not rendered.
- The globe shows only its turning wireframe, without the network, because at that size the network would cross the
  heading.

**CSS scoping:**
- New rules in `app/globals.css` are prefixed `.values-world` (the section's class), inside the existing
  reduced-motion block.
- The two new keyframes are prefixed `vw-` (`vw-light`, `vw-icon`).
- The globe and horizon sizes are CSS variables set on the section element itself.
- No shared rule was modified.

## Responsive results

Tested in Chrome at 320, 390, 768, 1024 and 1440 px. Screenshots are in
`/private/tmp/claude-501/-Users-muhammedshareefcv-Desktop-Mcl-webiste-/f3b9de83-f7ce-4c47-b4c4-23c57f4a241d/scratchpad/about/`
(`values-1440.png`, `values-1024.png`, `values-768.png`, `values-390.png`, `values-320.png`).

| Width | Layout | Section height | Overflow | Errors |
|---|---|---|---|---|
| 1440 | 5 cards in one row, globe network, card links | 753 px | 0 | none |
| 1024 | 3 + 2 cards, centred | 867 px | 0 | none |
| 768 | 2 + 2 + 1 cards | 1,042 px | 0 | none |
| 390 | 1 column, lightweight background | 1,489 px | 0 | none |
| 320 | 1 column, lightweight background | 1,614 px | 0 | none |

- **Other pages:** `/`, `/services` and `/contact` load with status 200 and contain none of the new section's markup.
- **Animation:** confirmed running, with a globe particle moving across the face between samples.

## Build and lint

- `tsc --noEmit`: pass
- `eslint .`: pass
- `vitest`: 47 / 47 pass
- `npm run build`: pass (compiled successfully)

## Remaining issues

1. **The globe is illustrative.** It is a wireframe globe, not a photographic Earth. A rendered globe or 3D Earth image
   would need a licensed asset.
2. **The port is a distant silhouette.** The project has no photography of a port or cranes.
3. **The ocean shows no real waves:** it is a still aerial texture with a moving ripple layer.
4. **Screenshot tools:** the site scrolls smoothly, so automated captures must scroll instantly before taking a picture,
   or the section is captured before it arrives.

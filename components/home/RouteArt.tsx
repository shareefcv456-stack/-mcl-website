/**
 * Small top-down illustrations of the vehicles on the Our Services routes, drawn in the MCL palette (navy, royal blue,
 * cyan). Each is centred on (0, 0) with its nose or bow pointing along +x, so SVG motion along a path (rotate="auto")
 * turns it to face the direction of travel. Units are those of the route drawing (viewBox 600 × 220).
 * <RouteArtDefs /> must be rendered once in the same <svg>: the gradients and shadow are shared by reference.
 */

const NAVY = "#0b1533";
const NAVY_800 = "#13204a";
const BRAND = "#2c35d4";
const CYAN = "#67e8f9";
const PERIWINKLE = "#aab3ff";

export function RouteArtDefs() {
  return (
    <defs>
      <linearGradient id="route-art-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d9dff0" />
      </linearGradient>
      <linearGradient id="route-art-wing" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c7cee3" />
        <stop offset="1" stopColor="#f5f7fc" />
      </linearGradient>
      <linearGradient id="route-art-cargo-light" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor={NAVY} stopOpacity="0.18" />
      </linearGradient>
      <radialGradient id="route-art-glow">
        <stop offset="0" stopColor={CYAN} stopOpacity="0.45" />
        <stop offset="1" stopColor={CYAN} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="route-art-wake" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={BRAND} stopOpacity="0" />
        <stop offset="1" stopColor={BRAND} stopOpacity="0.35" />
      </linearGradient>
      <filter id="route-art-shadow" x="-40%" y="-60%" width="180%" height="220%">
        <feDropShadow dx="1.5" dy="3.5" stdDeviation="1.8" floodColor={NAVY} floodOpacity="0.3" />
      </filter>
    </defs>
  );
}

/** A twin-engine airliner seen from above, about 38 × 34 units. */
export function PlaneArt() {
  const edge = { stroke: NAVY, strokeOpacity: 0.28, strokeWidth: 0.45, strokeLinejoin: "round" as const };
  return (
    <g filter="url(#route-art-shadow)">
      {/* Swept wings with royal-blue tips */}
      <path d="M4 -2.2 L-5.5 -17.5 L-9.6 -17.5 L-4.6 -2.2 Z M4 2.2 L-5.5 17.5 L-9.6 17.5 L-4.6 2.2 Z" fill="url(#route-art-wing)" {...edge} />
      <path d="M-5.5 -17.5 L-9.6 -17.5 L-9 -15.8 L-4.5 -15.8 Z M-5.5 17.5 L-9.6 17.5 L-9 15.8 L-4.5 15.8 Z" fill={BRAND} />
      {/* Engines under the wings */}
      <rect x="-1.2" y="-10.2" width="4.6" height="2.3" rx="1.1" fill="#8e9ab9" {...edge} />
      <rect x="-1.2" y="7.9" width="4.6" height="2.3" rx="1.1" fill="#8e9ab9" {...edge} />
      {/* Tailplane */}
      <path d="M-13 -1.6 L-17.6 -7.6 L-19.8 -7.6 L-17 -1.6 Z M-13 1.6 L-17.6 7.6 L-19.8 7.6 L-17 1.6 Z" fill="url(#route-art-wing)" {...edge} />
      {/* Fuselage */}
      <path d="M18.5 0 C18.5 -1.7 16.4 -2.5 13.2 -2.5 L-15 -2.3 C-18.2 -2.1 -19.8 -1.1 -20.4 0 C-19.8 1.1 -18.2 2.1 -15 2.3 L13.2 2.5 C16.4 2.5 18.5 1.7 18.5 0 Z" fill="url(#route-art-body)" {...edge} />
      {/* Royal-blue spine and fin, cyan cheat line */}
      <rect x="-20" y="-0.65" width="7" height="1.3" rx="0.6" fill={BRAND} />
      <rect x="-12.5" y="-0.3" width="24" height="0.6" rx="0.3" fill={CYAN} />
      {/* Cockpit glazing */}
      <path d="M15.6 -1.45 Q17.4 0 15.6 1.45 L14.6 1.1 L14.6 -1.1 Z" fill={NAVY} fillOpacity="0.85" />
    </g>
  );
}

const CARGO = [BRAND, CYAN, PERIWINKLE, "#ffffff", BRAND, "#1e9fc0", PERIWINKLE, BRAND, "#ffffff", CYAN, BRAND, PERIWINKLE];

/** A container ship seen from above with its wake, about 53 × 12 units (wake trails a further 24 behind). */
export function ShipArt() {
  return (
    <g>
      {/* Wake: two faint arms and a centre line, fading out behind the stern */}
      <path d="M-26 -4.5 Q-38 -8.5 -50 -12 M-26 4.5 Q-38 8.5 -50 12 M-27 0 L-46 0" fill="none" stroke="url(#route-art-wake)" strokeWidth="1.3" strokeLinecap="round" />
      <g filter="url(#route-art-shadow)">
        {/* Hull and forecastle */}
        <path d="M-25 -6 L13 -6 C19 -6 24 -3 27 0 C24 3 19 6 13 6 L-25 6 C-26.2 6 -26.6 5 -26.6 4 L-26.6 -4 C-26.6 -5 -26.2 -6 -25 -6 Z" fill={NAVY_800} stroke={BRAND} strokeWidth="0.6" />
        <path d="M16.5 -4.6 C20.6 -3.8 23.4 -1.9 25 0 C23.4 1.9 20.6 3.8 16.5 4.6 Z" fill="#22306a" />
        {/* Two rows of containers, lit from above */}
        {CARGO.map((c, i) => (
          <rect key={i} x={-15.6 + (i % 6) * 5.2} y={i < 6 ? -4.7 : 0.25} width="4.9" height="4.45" rx="0.35" fill={c} stroke={NAVY} strokeOpacity="0.35" strokeWidth="0.3" />
        ))}
        <rect x="-15.6" y="-4.7" width="31.1" height="9.4" fill="url(#route-art-cargo-light)" />
        {/* Bridge at the stern: white superstructure, navy windows facing forward, royal-blue funnel */}
        <rect x="-24" y="-5.1" width="6.4" height="10.2" rx="1" fill="#f3f5fb" stroke={NAVY} strokeOpacity="0.3" strokeWidth="0.35" />
        <rect x="-18.8" y="-4.3" width="0.9" height="8.6" rx="0.3" fill={NAVY} fillOpacity="0.85" />
        <circle cx="-22.2" cy="0" r="1.35" fill={BRAND} />
      </g>
    </g>
  );
}

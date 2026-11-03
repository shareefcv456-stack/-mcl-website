"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Anchor, House, Plane, Ship, Truck, Warehouse } from "lucide-react";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { PlaneArt, RouteArtDefs, ShipArt } from "@/components/home/RouteArt";
import { cn } from "@/lib/utils/cn";

/*
 * About › Our Network: a logistics control map (viewBox 1200 × 620). Cargo leaves the origin port by sea or by air,
 * arrives at the destination port and goes on by road to the delivery point: stages 01 → 04. Picking a mode brings
 * its route, vehicle and a short explanation forward and dims the others. Styles: .bp-* in globals.css.
 * Motion runs only once the map is on screen (PauseOffscreen); reduced motion parks every vehicle on its route.
 * Tablet and up show the map; phones get the same journey as a vertical list.
 */
type Mode = "sea" | "air" | "land";
const ORIGIN: [number, number] = [190, 330];
const PORT: [number, number] = [830, 330];
const DELIVERY: [number, number] = [1100, 505];
// Not mirror images of each other: the sea lane is a long, shallow shipping lane south of the direct line, the flight
// arc climbs high, peaks right of centre and comes down steeply to the port. The road leaves the port east, then bends south to the delivery point.
const ROUTES: Record<Mode, { d: string; dur: number; begin: number }> = {
  sea: { d: "M190 330 C 260 420, 420 455, 560 445 S 780 400, 830 330", dur: 18, begin: 1.2 },
  air: { d: "M190 330 C 260 150, 470 70, 640 105 S 800 230, 830 330", dur: 12, begin: 2.4 },
  land: { d: "M830 330 H 920 Q 950 330 962 358 L 1000 440 Q 1012 468 1042 474 L 1070 478 Q 1100 484 1100 505", dur: 9, begin: 3.6 },
};
// Each vehicle's place and heading on its route for reduced motion (worked out from the paths above).
const PARKED: Record<Mode, string> = { sea: "translate(560 445) rotate(-3)", air: "translate(640 105) rotate(8)", land: "translate(981 399) rotate(65)" };

const MODES: { id: Mode; label: string; icon: typeof Ship; text: string }[] = [
  { id: "sea", label: "Sea Freight", icon: Ship, text: "Cost-effective and secure shipping for your cargo, FCL or LCL, with packing, loading and customs clearance handled for you." },
  { id: "air", label: "Air Freight", icon: Plane, text: "For time-sensitive shipments: the fastest and most efficient delivery, with premium and economy options." },
  { id: "land", label: "Land Transport", icon: Truck, text: "Reliable, efficient transport from the port to the final delivery point, with real-time tracking along the way." },
];
// Map labels: each mode label beside its route (not on it); stage labels clear of every route. The mode labels show
// from 1025px only: on a narrower map they would cover the road and the aircraft, and the mode buttons below already
// name and highlight each route.
const MODE_LABELS: [Mode, [number, number]][] = [["air", [640, 62]], ["sea", [560, 492]], ["land", [1110, 395]]];
const STAGES = [
  { n: "01", title: "Cargo Collection", place: "Origin port", icon: Warehouse, modes: [] as Mode[], at: ORIGIN, align: "left" },
  { n: "02", title: "International Shipping", place: "By sea or by air", icon: Ship, modes: ["sea", "air"] as Mode[], at: [510, 300], align: "center" },
  { n: "03", title: "Port Arrival", place: "Destination port", icon: Anchor, modes: [] as Mode[], at: [852, 304], align: "above-right" },
  { n: "04", title: "Final Delivery", place: "Delivery point", icon: House, modes: ["land"] as Mode[], at: DELIVERY, align: "below" },
] as const;
const STAGE_PLACE = {
  below: "-translate-x-1/2 translate-y-5 min-[1025px]:translate-y-7",
  left: "-translate-x-[calc(100%+14px)] -translate-y-1/2 min-[1025px]:-translate-x-[calc(100%+28px)]",
  "above-right": "-translate-y-full",
  center: "-translate-x-1/2 -translate-y-1/2",
};

const pct = ([x, y]: readonly [number, number]) => ({ left: `${(x / 1200) * 100}%`, top: `${(y / 620) * 100}%` });

/** A container truck seen from above, nose to +x: ribbed container on its trailer, cab with windscreen and mirrors. */
function TruckArt() {
  return (
    <g filter="url(#route-art-shadow)">
      {/* Wheels just showing at the sides */}
      {[-17, -12, 1, 13].map((x) => <rect key={x} x={x} y={-7.2} width={3.6} height={14.4} rx={1} fill="#020c1c" />)}
      {/* Container with its ribs */}
      <rect x="-21" y="-6.2" width="28" height="12.4" rx="1" fill="url(#route-art-body)" stroke="#0b1533" strokeOpacity="0.35" strokeWidth="0.5" />
      {[-17, -13, -9, -5, -1, 3].map((x) => <path key={x} d={`M${x} -5.6 V5.6`} stroke="#8e9ab9" strokeOpacity="0.6" strokeWidth="0.45" />)}
      <rect x="-21" y="-1" width="28" height="2" fill="#2c35d4" fillOpacity="0.85" />
      {/* Cab, windscreen and mirrors */}
      <path d="M9 -5.6 H16 Q19.6 -5.6 19.6 -2 V2 Q19.6 5.6 16 5.6 H9 Z" fill="#13204a" stroke="#2c35d4" strokeWidth="0.6" />
      <path d="M15.6 -4.2 Q18.4 -3 18.4 0 Q18.4 3 15.6 4.2 Z" fill="#67e8f9" fillOpacity="0.85" />
      <rect x="13.2" y="-7.4" width="2" height="1.6" rx="0.5" fill="#13204a" />
      <rect x="13.2" y="5.8" width="2" height="1.6" rx="0.5" fill="#13204a" />
    </g>
  );
}

const ART: Record<Mode, { art: () => ReactNode; scale: number }> = {
  sea: { art: ShipArt, scale: 1.45 },
  air: { art: PlaneArt, scale: 1.3 },
  land: { art: TruckArt, scale: 1.2 },
};

function Vehicle({ mode, active }: { mode: Mode; active: boolean }) {
  const { art: Art, scale } = ART[mode];
  const r = ROUTES[mode];
  const timing = { dur: `${r.dur}s`, begin: `${r.begin}s`, repeatCount: "indefinite" } as const;
  const body = (
    <g transform={`scale(${scale})`}>
      {/* Picked: a soft ring of light around the vehicle. */}
      <circle r={28} fill="url(#bp-halo)" className={cn("transition-opacity duration-500", active ? "opacity-100" : "opacity-0")} />
      {mode === "air" && <g transform="translate(10 16)" opacity={0.28} filter="url(#bp-soft)"><path d="M18.5 0 L-20 -2.4 L-5.5 -17.5 L-9.6 -17.5 L-4.6 -2.2 L-17.6 -7.6 L-19.8 -7.6 L-20.4 0 L-19.8 7.6 L-17.6 7.6 L-4.6 2.2 L-9.6 17.5 L-5.5 17.5 L-20 2.4 Z" fill="#000814" /></g>}
      <Art />
    </g>
  );
  return (
    <>
      {/* Travels the middle 90% of its route, so it never sits on a port or delivery marker. */}
      <g className="motion-reduce:hidden" opacity={0}>
        <animateMotion path={r.d} rotate="auto" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" keyPoints="0.05;0.95" {...timing} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" {...timing} />
        {body}
      </g>
      <g className="hidden motion-reduce:inline" transform={PARKED[mode]}>{body}</g>
    </>
  );
}

/** A port or delivery marker: a lucide icon in a ringed disc, over a gently pulsing ring. */
function Marker({ at: [x, y], icon: Icon, i }: { at: [number, number]; icon: typeof Anchor; i: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={18} className="net-node" style={{ "--i": i } as CSSProperties} stroke="#a9bdd6" strokeOpacity="0.5" strokeWidth="1" />
      <circle cx={x} cy={y} r={14} fill="#0a1d3b" stroke="#c7d5e6" strokeOpacity="0.7" strokeWidth="1.5" />
      <Icon x={x - 8} y={y - 8} width={16} height={16} color="#ffffff" strokeWidth={2} aria-hidden />
    </g>
  );
}

export function NetworkBlueprint() {
  const [active, setActive] = useState<Mode | null>(null);
  const picked = MODES.find((m) => m.id === active);
  const dim = (m: Mode) => (active && active !== m ? "opacity-25" : "opacity-100");
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0c2246_0%,#081a36_100%)] text-white shadow-[0_40px_80px_-40px_rgb(7_27_58/0.8)]">
      <PauseOffscreen aria-hidden className="bp ship-scene relative hidden aspect-[1200/620] min-[768px]:block">
        <svg viewBox="0 0 1200 620" className="absolute inset-0 size-full" fill="none">
          <RouteArtDefs />
          <defs>
            <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 H0 V40" stroke="#a9bdd6" strokeOpacity="0.04" /></pattern>
            <pattern id="bp-grid-major" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M200 0 H0 V200" stroke="#a9bdd6" strokeOpacity="0.07" /></pattern>
            <radialGradient id="bp-deep" cx="47%" cy="66%" r="50%"><stop offset="0" stopColor="#123a66" stopOpacity="0.45" /><stop offset="1" stopColor="#123a66" stopOpacity="0" /></radialGradient>
            <linearGradient id="bp-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#142d4f" /><stop offset="1" stopColor="#0e2341" /></linearGradient>
            <filter id="bp-lift" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000814" floodOpacity="0.55" /></filter>
            <radialGradient id="bp-halo"><stop offset="0.4" stopColor="#7dd3e8" stopOpacity="0.18" /><stop offset="1" stopColor="#7dd3e8" stopOpacity="0" /></radialGradient>
            <filter id="bp-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
            <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          {/* Control-map ground: a faint technical grid, deeper water along the sea lane and its depth contours. */}
          <g className="scroll-depth [--depth:8px]">
            <rect x="-40" y="-40" width="1280" height="700" fill="url(#bp-grid)" />
            <rect x="-40" y="-40" width="1280" height="700" fill="url(#bp-grid-major)" />
          </g>
          <rect width="1200" height="620" fill="url(#bp-deep)" />
          <g stroke="#a9bdd6" strokeOpacity="0.06" strokeWidth="1">
            {[[300, 92], [240, 72], [180, 54], [120, 36], [64, 19]].map(([rx, ry]) => (
              <ellipse key={rx} cx={540} cy={440} rx={rx} ry={ry} transform="rotate(-4 540 440)" />
            ))}
          </g>
          {/* Two coastlines with their ports: shaded land lifted off the sea, a lit shoreline, a quay at each port. */}
          <g filter="url(#bp-lift)">
            <path d="M0 200 L 140 206 Q 214 254 204 330 Q 198 418 132 470 L 0 520 Z" fill="url(#bp-land)" />
            <path d="M1200 186 L 890 200 Q 806 250 816 330 Q 828 420 902 470 L 960 620 L 1200 620 Z" fill="url(#bp-land)" />
          </g>
          <g fill="none" strokeWidth="1.2">
            <path d="M140 206 Q 214 254 204 330 Q 198 418 132 470" stroke="#a9bdd6" strokeOpacity="0.35" />
            <path d="M890 200 Q 806 250 816 330 Q 828 420 902 470 L 960 620" stroke="#a9bdd6" strokeOpacity="0.35" />
            <path d="M112 226 Q 180 266 172 330 Q 166 400 110 446" stroke="#a9bdd6" strokeOpacity="0.08" strokeDasharray="3 6" />
            <path d="M908 222 Q 846 262 854 330 Q 864 404 930 460" stroke="#a9bdd6" strokeOpacity="0.08" strokeDasharray="3 6" />
          </g>
          <g fill="#1a3558" stroke="#a9bdd6" strokeOpacity="0.35" strokeWidth="1">
            <rect x="198" y="352" width="34" height="9" rx="1.5" />
            <rect x="788" y="352" width="34" height="9" rx="1.5" />
          </g>
          <text x={1186} y={34} textAnchor="end" fill="#a9bdd6" fillOpacity="0.45" fontSize="11" fontWeight="600" letterSpacing="3">AIRSPACE</text>
          <text x={260} y={600} textAnchor="middle" fill="#a9bdd6" fillOpacity="0.4" fontSize="11" fontWeight="600" letterSpacing="3">OPEN SEA</text>
          {/* The road inland: a lit kerb, dark carriageway and dashed centre line. */}
          <path d={ROUTES.land.d} stroke="#a9bdd6" strokeOpacity="0.2" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" />
          <path d={ROUTES.land.d} stroke="#04112a" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d={ROUTES.land.d} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="6 7" />
          {/* Routes: one stroke weight for all three, drawing in once. At rest they are a muted ice blue-grey; the picked one
              turns a restrained cyan and alone gets a soft glow. */}
          {MODES.map(({ id }, i) => (
            <g key={id} className={cn("transition-opacity duration-500", dim(id))}>
              <path d={ROUTES[id].d} stroke="#7dd3e8" strokeOpacity={active === id ? 0.22 : 0} strokeWidth="6" filter="url(#bp-glow)" className="transition-[stroke-opacity] duration-500" />
              <path id={`bp-route-${id}`} d={ROUTES[id].d} pathLength={1} style={{ "--i": i } as CSSProperties} stroke={active === id ? "#a5e3f0" : "#b4c6dc"} strokeOpacity={active === id ? 1 : 0.7} strokeWidth={active === id ? 2.2 : 1.6} strokeLinecap="round" className="net-draw transition-[stroke,stroke-opacity,stroke-width] duration-500" />
              <circle r="2.5" fill="#e6eef8" className="motion-reduce:hidden" opacity={0}>
                <animateMotion dur={`${ROUTES[id].dur * 0.45}s`} begin={`${ROUTES[id].begin + 1}s`} repeatCount="indefinite"><mpath href={`#bp-route-${id}`} /></animateMotion>
                <animate attributeName="opacity" values="0;0.6;0.6;0" keyTimes="0;0.1;0.9;1" dur={`${ROUTES[id].dur * 0.45}s`} begin={`${ROUTES[id].begin + 1}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Vehicles, each on its own route and clock. */}
          {MODES.map(({ id }) => (
            <g key={id} className={cn("transition-opacity duration-500", dim(id))}><Vehicle mode={id} active={active === id} /></g>
          ))}
          <Marker at={ORIGIN} icon={Warehouse} i={0} />
          <Marker at={PORT} icon={Anchor} i={1} />
          <Marker at={DELIVERY} icon={House} i={2} />
        </svg>
        {/* Labels, in HTML for crisp text: the three modes beside their routes, the four stages at their places. Below
            1025px the map is too narrow for full labels, so stages show just their number here and are listed in full
            under the map. */}
        <div className="pointer-events-none absolute inset-0 text-[0.6875rem] min-[1025px]:text-xs">
          {MODE_LABELS.map(([id, at]) => {
            const m = MODES.find((x) => x.id === id)!;
            return (
              <span key={id} style={pct(at)} className={cn("absolute hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border px-3 py-1 min-[1025px]:inline-flex font-semibold whitespace-nowrap tracking-[0.12em] uppercase backdrop-blur-sm transition-[opacity,border-color,background-color] duration-500", active === id ? "border-[#7dd3e8]/60 bg-[#7dd3e8]/10 text-white" : "border-white/15 bg-[#0a1d3b]/80 text-slate-200", dim(id))}>
                <m.icon aria-hidden className="size-3.5" strokeWidth={2} />{m.label}
              </span>
            );
          })}
          {STAGES.map((s, i) => (
            <span key={s.n} style={{ ...pct(s.at), "--i": i } as CSSProperties} className={cn("bp-stage absolute flex items-center gap-2 rounded-xl border border-white/15 bg-[#061631]/85 p-1 whitespace-nowrap backdrop-blur-sm min-[1025px]:py-1.5 min-[1025px]:pr-3 min-[1025px]:pl-1.5", STAGE_PLACE[s.align])}>
              <span className="bp-stage-n grid size-7 place-items-center rounded-lg bg-white/10 font-mono text-[0.6875rem] font-semibold text-slate-200">{s.n}</span>
              <span className="hidden leading-tight min-[1025px]:block"><span className="block font-semibold text-white">{s.title}</span><span className="block text-slate-300/80">{s.place}</span></span>
            </span>
          ))}
        </div>
      </PauseOffscreen>
      {/* Mode picker and explanation. */}
      <div className="grid gap-4 border-t border-white/10 bg-[#061631]/60 p-4 min-[641px]:p-6 min-[1025px]:grid-cols-[auto_minmax(0,1fr)] min-[1025px]:items-center">
        <div role="group" aria-label="Show a transport mode" className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button key={m.id} type="button" aria-pressed={active === m.id} onClick={() => setActive(active === m.id ? null : m.id)}
              className={cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3e8]", active === m.id ? "border-[#7dd3e8]/70 bg-[#7dd3e8]/15 text-white" : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10")}>
              <m.icon aria-hidden className="size-4" strokeWidth={2} />{m.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="m-0 text-[0.9375rem] leading-relaxed text-slate-200/90">
          {picked ? <><strong className="text-white">{picked.label}:</strong> {picked.text}</> : "Choose a mode to follow its route: cargo leaves the origin port by sea or by air, arrives at the destination port and goes on by road to its final delivery point."}
        </p>
      </div>
      {/* The stages in full: on phones as a vertical route (the map would be too small to read), on tablets as two
          columns under the map. The mode buttons above highlight the step their transport covers. */}
      <ol className="bp relative m-0 grid list-none gap-3 border-t border-white/10 p-4 min-[768px]:grid-cols-2 min-[768px]:p-6 min-[1025px]:hidden">
        <span aria-hidden className="absolute top-10 bottom-10 left-[46px] w-px bg-[linear-gradient(180deg,rgb(169_189_214/0.6),rgb(169_189_214/0.15))] min-[768px]:hidden" />
        {STAGES.map((step, i) => (
          <li key={step.n} style={{ "--i": i } as CSSProperties} className="bp-stage relative flex gap-3 rounded-2xl border border-white/15 bg-[#061631]/90 p-3">
            <span className="bp-stage-n relative z-10 grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 font-mono text-xs font-semibold text-slate-200">{step.n}</span>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[0.9375rem] leading-tight font-semibold text-white">{step.title}</p>
              <p className="m-0 text-[0.8125rem] text-slate-300/80">{step.place}</p>
              {step.modes.length > 0 && (
                <ul className="m-0 mt-2 flex list-none flex-wrap gap-1.5 p-0">
                  {step.modes.map((id) => {
                    const m = MODES.find((x) => x.id === id)!;
                    return (
                      <li key={id} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors duration-300", active === id ? "border-[#7dd3e8]/70 bg-[#7dd3e8]/15 text-white" : "border-white/20 text-slate-200", active && active !== id && "opacity-50")}>
                        <m.icon aria-hidden className="size-3.5" strokeWidth={2} />{m.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <step.icon aria-hidden className="mt-1 size-4 shrink-0 text-slate-300/70" strokeWidth={2} />
          </li>
        ))}
      </ol>
    </div>
  );
}

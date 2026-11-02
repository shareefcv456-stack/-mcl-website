"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Plane, Ship, Truck } from "lucide-react";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { PlaneArt, RouteArtDefs, ShipArt } from "@/components/home/RouteArt";
import { cn } from "@/lib/utils/cn";

/*
 * About › Our Network: a logistics blueprint (viewBox 1200 × 620). Cargo leaves the origin port by sea or by air,
 * arrives at the destination port, and goes on by road to the delivery point: stages 01 → 04. Each mode can be picked
 * to bring its route, vehicle and a short explanation forward. Styles: .bp-* in globals.css.
 * Motion runs only once the scene is on screen (PauseOffscreen) and is replaced by a still scene for reduced motion.
 */
type Mode = "sea" | "air" | "land";
const ORIGIN: [number, number] = [200, 340];
const PORT: [number, number] = [815, 340];
const DELIVERY: [number, number] = [1100, 500];
const ROUTES: Record<Mode, { d: string; dur: number; begin: number }> = {
  sea: { d: "M200 340 C 300 520, 700 540, 815 340", dur: 16, begin: 1.2 },
  air: { d: "M200 340 C 300 80, 720 80, 815 340", dur: 11, begin: 2.4 },
  land: { d: "M815 340 L 930 340 Q 960 340 975 370 L 1040 480 Q 1052 500 1075 500 L 1100 500", dur: 8, begin: 3.6 },
};
// Where each vehicle is parked for reduced motion: a point on its route, and the heading there.
const PARKED: Record<Mode, string> = { sea: "translate(502 482)", air: "translate(505 147)", land: "translate(1007 425) rotate(60)" };

const MODES: { id: Mode; label: string; icon: typeof Ship; text: string }[] = [
  { id: "sea", label: "Sea Freight", icon: Ship, text: "Cost-effective and secure shipping for your cargo, FCL or LCL, with packing, loading and customs clearance handled for you." },
  { id: "air", label: "Air Freight", icon: Plane, text: "For time-sensitive shipments: the fastest and most efficient delivery, with premium and economy options." },
  { id: "land", label: "Land Transport", icon: Truck, text: "Reliable, efficient transport from the port to the final delivery point, with real-time tracking along the way." },
];
const STAGES = [
  { n: "01", title: "Cargo Collection", place: "Origin port", at: ORIGIN, align: "left" },
  { n: "02", title: "International Shipping", place: "By sea or by air", at: [505, 330], align: "center" },
  { n: "03", title: "Port Arrival", place: "Destination port", at: [840, 318], align: "above-right" },
  { n: "04", title: "Final Delivery", place: "Delivery point", at: DELIVERY, align: "below" },
] as const;

const pct = ([x, y]: readonly [number, number]) => ({ left: `${(x / 1200) * 100}%`, top: `${(y / 620) * 100}%` });

/** A container truck seen from above, nose to +x: container trailer, navy cab, lit windscreen. */
function TruckArt() {
  return (
    <g filter="url(#route-art-shadow)">
      <rect x="-22" y="-6" width="30" height="12" rx="1.2" fill="url(#route-art-body)" stroke="#0b1533" strokeOpacity="0.3" strokeWidth="0.5" />
      <rect x="-20" y="-1" width="26" height="2" rx="0.6" fill="#2c35d4" />
      <rect x="10" y="-5.4" width="9" height="10.8" rx="2" fill="#13204a" stroke="#2c35d4" strokeWidth="0.6" />
      <path d="M17 -4 Q19.4 0 17 4 L15.8 3.2 L15.8 -3.2 Z" fill="#67e8f9" fillOpacity="0.85" />
    </g>
  );
}

const ART: Record<Mode, { art: () => ReactNode; scale: number }> = {
  sea: { art: ShipArt, scale: 1.5 },
  air: { art: PlaneArt, scale: 1.35 },
  land: { art: TruckArt, scale: 1.25 },
};

function Vehicle({ mode, active }: { mode: Mode; active: boolean }) {
  const { art: Art, scale } = ART[mode];
  const r = ROUTES[mode];
  const timing = { dur: `${r.dur}s`, begin: `${r.begin}s`, repeatCount: "indefinite" } as const;
  const body = (
    <g transform={`scale(${scale})`}>
      {/* Picked: a soft ring of light around the vehicle. */}
      <circle r={30} fill="url(#bp-halo)" className={cn("transition-opacity duration-500", active ? "opacity-100" : "opacity-0")} />
      {mode === "air" && <g transform="translate(10 16)" opacity={0.3} filter="url(#bp-soft)"><path d="M18.5 0 L-20 -2.4 L-5.5 -17.5 L-9.6 -17.5 L-4.6 -2.2 L-17.6 -7.6 L-19.8 -7.6 L-20.4 0 L-19.8 7.6 L-17.6 7.6 L-4.6 2.2 L-9.6 17.5 L-5.5 17.5 L-20 2.4 Z" fill="#000814" /></g>}
      <Art />
    </g>
  );
  return (
    <>
      <g className="motion-reduce:hidden" opacity={0}>
        <animateMotion path={r.d} rotate="auto" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" keyPoints="0;1" {...timing} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" {...timing} />
        {body}
      </g>
      <g className="hidden motion-reduce:inline" transform={PARKED[mode]}>{body}</g>
    </>
  );
}

export function NetworkBlueprint() {
  const [active, setActive] = useState<Mode | null>(null);
  const picked = MODES.find((m) => m.id === active);
  const dim = (m: Mode) => (active && active !== m ? "opacity-25" : "opacity-100");
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(70%_80%_at_50%_40%,#0d3466_0%,#081d3d_60%,#061631_100%)] text-white shadow-[0_40px_80px_-40px_rgb(7_27_58/0.8)]">
      <PauseOffscreen aria-hidden className="bp ship-scene relative aspect-[1200/620]">
        <svg viewBox="0 0 1200 620" className="absolute inset-0 size-full" fill="none">
          <RouteArtDefs />
          <defs>
            <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 H0 V40" stroke="#7fd8ff" strokeOpacity="0.07" /></pattern>
            <pattern id="bp-grid-major" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M200 0 H0 V200" stroke="#7fd8ff" strokeOpacity="0.14" /></pattern>
            <radialGradient id="bp-halo"><stop offset="0.4" stopColor="#67e8f9" stopOpacity="0.35" /><stop offset="1" stopColor="#67e8f9" stopOpacity="0" /></radialGradient>
            <filter id="bp-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
            <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          {/* Blueprint ground: fine and major grid, coordinate ticks along the top and left. */}
          <g className="scroll-depth [--depth:10px]">
            <rect x="-40" y="-40" width="1280" height="700" fill="url(#bp-grid)" />
            <rect x="-40" y="-40" width="1280" height="700" fill="url(#bp-grid-major)" />
          </g>
          <g fill="#7fd8ff" fillOpacity="0.45" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="1">
            {["A", "B", "C", "D", "E", "F"].map((c, i) => <text key={c} x={i * 200 + 8} y={16}>{c}</text>)}
            {["1", "2", "3"].map((r, i) => <text key={r} x={6} y={i * 200 + 32}>{r}</text>)}
            <text x={1192} y={612} textAnchor="end">MCL · NETWORK</text>
          </g>
          {/* Two coastlines with the sea between them; the airspace band above. */}
          <g stroke="#7fd8ff" strokeOpacity="0.35" strokeWidth="1.2">
            <path d="M0 210 L 150 214 Q 220 262 212 340 Q 205 420 140 470 L 0 520 Z" fill="#0f3a6c" fillOpacity="0.55" />
            <path d="M1200 190 L 880 204 Q 798 252 808 340 Q 820 420 900 470 L 960 620 L 1200 620 Z" fill="#0f3a6c" fillOpacity="0.55" />
          </g>
          <g stroke="#7fd8ff" strokeOpacity="0.12" strokeWidth="1">
            {[420, 470, 520, 570].map((y, i) => <path key={y} d={`M${250 + i * 10} ${y} q 40 -10 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} />)}
          </g>
          <path d="M0 230 H1200" stroke="#7fd8ff" strokeOpacity="0.12" strokeDasharray="4 8" />
          <text x={1188} y={222} textAnchor="end" fill="#7fd8ff" fillOpacity="0.5" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="2">AIRSPACE</text>
          <text x={500} y={600} textAnchor="middle" fill="#7fd8ff" fillOpacity="0.4" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="2">OPEN SEA</text>
          {/* The road inland: a carriageway with a dashed centre line. */}
          <path d={ROUTES.land.d} stroke="#7fd8ff" strokeOpacity="0.3" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" />
          <path d={ROUTES.land.d} stroke="#04112a" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d={ROUTES.land.d} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="6 7" />
          {/* Routes: a soft glow under a fine line that draws in, with light travelling along it. */}
          {MODES.map(({ id }, i) => (
            <g key={id} className={cn("transition-opacity duration-500", dim(id))}>
              <path d={ROUTES[id].d} stroke="#67e8f9" strokeOpacity={active === id ? 0.6 : 0.3} strokeWidth="6" filter="url(#bp-glow)" />
              <path id={`bp-${id}`} d={ROUTES[id].d} pathLength={1} className="net-draw" style={{ "--i": i } as CSSProperties} stroke={id === "air" ? "#ffffff" : "#bff3ff"} strokeOpacity="0.9" strokeWidth={active === id ? 2.4 : 1.6} strokeLinecap="round" />
              <circle r="3.5" fill="#fff" filter="url(#bp-soft)" className="motion-reduce:hidden" opacity={0}>
                <animateMotion dur={`${ROUTES[id].dur * 0.45}s`} begin={`${ROUTES[id].begin + 1}s`} repeatCount="indefinite"><mpath href={`#bp-${id}`} /></animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur={`${ROUTES[id].dur * 0.45}s`} begin={`${ROUTES[id].begin + 1}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Port and delivery markers, pulsing gently. */}
          {[ORIGIN, PORT, DELIVERY].map(([x, y], i) => (
            <g key={x}>
              <circle cx={x} cy={y} r={14} className="net-node" style={{ "--i": i } as CSSProperties} stroke="#67e8f9" strokeWidth="1.5" />
              <circle cx={x} cy={y} r={9} fill="#081d3d" stroke="#67e8f9" strokeWidth="2" />
              <circle cx={x} cy={y} r={3.5} fill="#ffffff" />
            </g>
          ))}
          {/* Vehicles, each on its own route and clock. */}
          {MODES.map(({ id }) => (
            <g key={id} className={cn("transition-opacity duration-500", dim(id))}><Vehicle mode={id} active={active === id} /></g>
          ))}
        </svg>
        {/* Labels, in HTML for crisp text: the three modes on their routes, and the four stages at their places.
            Tablet and up; phones get the same information as a list below the scene. */}
        <div className="pointer-events-none absolute inset-0 hidden text-[0.6875rem] min-[768px]:block">
          {([["air", [505, 112]], ["sea", [505, 520]], ["land", [925, 470]]] as const).map(([id, at]) => (
            <span key={id} style={pct(at)} className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1 font-semibold whitespace-nowrap tracking-[0.14em] uppercase backdrop-blur-sm transition-[opacity,border-color,background-color] duration-500", active === id ? "border-cyan-300/80 bg-cyan-300/20 text-white" : "border-white/20 bg-[#061631]/70 text-cyan-100", dim(id))}>
              {MODES.find((m) => m.id === id)!.label}
            </span>
          ))}
          {STAGES.map((s, i) => (
            <span key={s.n} style={{ ...pct(s.at), "--i": i } as CSSProperties} className={cn("bp-stage absolute flex items-center gap-2 rounded-xl border border-white/15 bg-[#061631]/80 py-1.5 pr-3 pl-1.5 whitespace-nowrap backdrop-blur-sm", { below: "-translate-x-1/2 translate-y-6", left: "-translate-x-[calc(100%+26px)] -translate-y-1/2", "above-right": "-translate-y-full", center: "-translate-x-1/2 -translate-y-1/2" }[s.align])}>
              <span className="bp-stage-n grid size-7 place-items-center rounded-lg bg-white/10 font-mono text-[0.6875rem] font-semibold text-cyan-200">{s.n}</span>
              <span className="leading-tight"><span className="block font-semibold text-white">{s.title}</span><span className="block text-cyan-100/70">{s.place}</span></span>
            </span>
          ))}
        </div>
      </PauseOffscreen>
      {/* Mode picker and explanation. */}
      <div className="grid gap-4 border-t border-white/10 bg-[#061631]/60 p-4 min-[641px]:p-6 min-[1025px]:grid-cols-[auto_minmax(0,1fr)] min-[1025px]:items-center">
        <div role="group" aria-label="Show a transport mode" className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button key={m.id} type="button" aria-pressed={active === m.id} onClick={() => setActive(active === m.id ? null : m.id)}
              className={cn("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-300", active === m.id ? "border-cyan-300 bg-cyan-300 text-[#061631]" : "border-white/20 bg-white/5 text-white hover:border-cyan-300/60 hover:bg-white/10")}>
              <m.icon aria-hidden className="size-4" strokeWidth={2} />{m.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="m-0 text-[0.9375rem] leading-relaxed text-cyan-50/85">
          {picked ? <><strong className="text-white">{picked.label}:</strong> {picked.text}</> : "Choose a mode to follow its route: cargo leaves the origin port by sea or by air, arrives at the destination port and goes on by road to its final delivery point."}
        </p>
      </div>
      {/* Phones: the four stages as a list (the scene's own labels show from tablet up). */}
      <ol className="m-0 grid list-none grid-cols-2 gap-px border-t border-white/10 bg-white/10 p-0 min-[768px]:hidden">
        {STAGES.map((s) => (
          <li key={s.n} className="flex gap-2.5 bg-[#061631] p-3.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/10 font-mono text-[0.6875rem] font-semibold text-cyan-200">{s.n}</span>
            <span className="text-[0.8125rem] leading-tight"><span className="block font-semibold text-white">{s.title}</span><span className="block text-cyan-100/70">{s.place}</span></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

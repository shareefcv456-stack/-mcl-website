"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { PROCESS } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

// Orbit badge angles (degrees clockwise from 3 o'clock). ±42° puts the badges at 1/6, 1/2 and 5/6 of the
// circle's height, matching the centres of the three step rows beside it on desktop.
const ORBIT_ANGLES = [222, 180, 138, 318, 0, 42];
// Rounded so the server HTML and the client render agree: browsers store inline styles at reduced precision.
const round = (n: number) => Math.round(n * 1000) / 1000;
const BADGES = ORBIT_ANGLES.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: round(50 + 50 * Math.cos(rad)), y: round(50 + 50 * Math.sin(rad)) };
});
// The smallest signed turn from one angle to another, so the orbit highlight never spins the long way round.
const shortest = (deg: number) => (((deg % 360) + 540) % 360) - 180;

const STEP_MS = 3600; // how long each step stays active while running on its own
const IDLE_MS = 6000; // how long the sequence waits after the visitor last touched it

// Optional next step per process step, only where the site already has the destination.
const STEP_ACTIONS: ({ label: string; href: string } | { label: string; quote: true } | undefined)[] = [
  { label: "Get a Quote", quote: true },
  { label: "View our services", href: "/services" },
  { label: "Get a Quote", quote: true },
  { label: "Track a shipment", href: "/tracking" },
  { label: "Track a shipment", href: "/tracking" },
  undefined,
];

/**
 * The six orbit badges of the Working Process infographic, plus a popup beside the active one.
 *
 * While the section is on screen the steps run on their own, 1 → 6 and round again, a few seconds each; a small
 * light travels the orbit to the active badge. Clicking (or Enter/Space on) a badge shows that step at once and
 * carries on from there; any interaction pauses the sequence until the visitor has been idle for a moment, and
 * hovering the popup holds it. It stops off screen and in a background tab. Escape or × closes the popup and stops
 * the sequence until a badge is chosen again. Reduced motion: nothing runs on its own; badges still open their step.
 *
 * Nothing is active in the server render or the first client render, so the HTML matches; step 1 only lights up
 * once the section has been seen.
 */
export function ProcessBadges({ badgeClass }: { badgeClass: string }) {
  const firstBadge = useRef<HTMLButtonElement>(null);
  const release = useRef<ReturnType<typeof setTimeout>>(undefined);
  const started = useRef(false);
  const [active, setActive] = useState<number | null>(null);
  const [turn, setTurn] = useState(0);
  const [onScreen, setOnScreen] = useState(false); // and allowed to move: always false for reduced motion
  const [tabHidden, setTabHidden] = useState(false);
  const [held, setHeld] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { openQuote } = useQuote();

  const show = useCallback((i: number) => {
    setActive(i);
    setTurn((t) => t + shortest(ORBIT_ANGLES[i] - t));
  }, []);
  const hold = () => {
    clearTimeout(release.current);
    setHeld(true);
  };
  const resumeLater = () => {
    clearTimeout(release.current);
    release.current = setTimeout(() => setHeld(false), IDLE_MS);
  };
  const touch = () => {
    hold();
    resumeLater();
  };
  const dismiss = () => {
    setActive(null);
    setDismissed(true);
  };
  const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && active !== null) dismiss();
  };

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const orbit = firstBadge.current?.parentElement;
    const io = new IntersectionObserver(
      ([e]) => {
        if (reduce) return;
        setOnScreen(e.isIntersecting);
        // Start at step 1 the first time the section is seen.
        if (e.isIntersecting && !started.current) {
          started.current = true;
          show(0);
        }
      },
      { threshold: 0.35 },
    );
    if (orbit) io.observe(orbit);
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(release.current);
    };
  }, [show]);

  const running = onScreen && !tabHidden && !held && !dismissed;
  // Advance one step at a time; re-armed on every change and cancelled the moment anything pauses it.
  useEffect(() => {
    if (!running || active === null) return;
    const t = setTimeout(() => show((active + 1) % PROCESS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [running, active, show]);

  const step = active === null ? null : PROCESS[active];
  const action = active === null ? undefined : STEP_ACTIONS[active];
  const at = active === null ? null : BADGES[active];

  return (
    <>
      {/* A small light that travels along the orbit to the active badge. */}
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 transition-[rotate,opacity] duration-1000 ease-smooth", active === null && "opacity-0")}
        style={{ rotate: `${turn}deg` }}
      >
        <span className="absolute top-1/2 right-0 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgb(103_232_249/0.6)]" />
      </span>
      {PROCESS.map((s, i) => (
        <button
          key={s.title}
          ref={i === 0 ? firstBadge : undefined}
          type="button"
          aria-label={`Step ${i + 1}: ${s.title}`}
          aria-controls={active === i ? "process-popup" : undefined}
          aria-expanded={active === i}
          data-step={i + 1}
          data-active={active === i ? "" : undefined}
          onClick={() => {
            setDismissed(false);
            show(i);
            touch();
          }}
          onFocus={touch}
          onKeyDown={onEscape}
          className={cn(
            badgeClass,
            "absolute size-10 -translate-1/2 cursor-pointer shadow-[0_6px_18px_rgb(2_8_24/0.45)] transition-[background-color,box-shadow,scale] duration-500 ease-smooth hover:scale-105 hover:bg-[#13306a] hover:ring-cyan-300/70 focus-visible:outline-cyan-300 data-active:scale-[1.14] sm:size-12",
          )}
          style={{ left: `${BADGES[i].x}%`, top: `${BADGES[i].y}%` }}
        >
          <s.icon aria-hidden className="size-[18px] sm:size-5" strokeWidth={1.75} />
        </button>
      ))}
      {active === null && (
        <p className="absolute inset-x-0 top-[calc(100%+14px)] m-0 text-center text-[0.875rem] text-[#a9b6d3] sm:hidden">
          Tap a step icon to see its details.
        </p>
      )}
      {step && at && active !== null && (
        <div
          key={active}
          id="process-popup"
          role="group"
          aria-label={`Step ${active + 1} of ${PROCESS.length}: ${step.title}`}
          onPointerEnter={hold}
          onPointerLeave={resumeLater}
          onFocus={touch}
          onKeyDown={onEscape}
          // Phones: just below the ring, in space the section reserves for it (the ring is too small to hold it
          // without covering badges). Tablets: centred inside the ring, narrow enough (62%) to clear every badge.
          // Desktop: beside the active badge, outside the ring and vertically centred on it.
          style={{ "--x": `${at.x}%`, "--y": `${at.y}%` } as CSSProperties}
          className={cn(
            "process-popup absolute top-[calc(100%+14px)] left-1/2 z-20 w-[min(320px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl border border-cyan-300/30 bg-[#0f2550]/95 p-4 text-left sm:top-1/2 sm:w-[62%] sm:-translate-y-1/2 shadow-[0_18px_40px_-12px_rgb(2_8_24/0.8),0_0_24px_-6px_rgb(103_232_249/0.35)] backdrop-blur-sm",
            "lg:top-[var(--y)] lg:w-[240px] lg:translate-x-0",
            at.x < 50 ? "lg:right-[calc(100%-var(--x)+34px)] lg:left-auto" : "lg:left-[calc(var(--x)+34px)]",
          )}
        >
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="text-[0.75rem] font-semibold tracking-[0.08em] text-cyan-300 tabular-nums uppercase">
              Step {String(active + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Close step details"
              onClick={dismiss}
              className="-m-1.5 grid size-7 cursor-pointer place-items-center rounded-full text-[#a9b6d3] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-cyan-300"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
          <h3 className="mb-1 text-[1.0625rem] leading-snug text-white">{step.title}</h3>
          <p className="m-0 text-[0.875rem] leading-[1.55] text-[#a9b6d3]">{step.text}</p>
          {action &&
            ("href" in action ? (
              <Link href={action.href} className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-cyan-300 hover:text-white focus-visible:outline-cyan-300">
                {action.label} <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            ) : (
              <button type="button" onClick={() => openQuote()} className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-[0.8125rem] font-semibold text-cyan-300 hover:text-white focus-visible:outline-cyan-300">
                {action.label} <ArrowRight aria-hidden className="size-3.5" />
              </button>
            ))}
        </div>
      )}
    </>
  );
}

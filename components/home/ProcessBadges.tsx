"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { buttonClass } from "@/components/ui/Button";
import { PROCESS } from "@/lib/content/home";
import { cn } from "@/lib/utils/cn";

// Orbit badge angles (degrees clockwise from 3 o'clock). ±42° puts the badges at 1/6, 1/2 and 5/6 of the
// circle's height, matching the centres of the three step rows beside it on desktop.
const ORBIT_ANGLES = [222, 180, 138, 318, 0, 42];
// Rounded so the server HTML and the client render agree: browsers store inline styles at reduced precision.
const percent = (n: number) => `${Math.round(n * 1000) / 1000}%`;

// Optional next step per process step, only where the site already has the destination.
const STEP_ACTIONS: ({ label: string; href: string } | { label: string; quote: true } | undefined)[] = [
  { label: "Get a Quote", quote: true },
  { label: "View our services", href: "/services" },
  { label: "Get a Quote", quote: true },
  { label: "Track a shipment", href: "/tracking" },
  { label: "Track a shipment", href: "/tracking" },
  undefined,
];

/** The six orbit badges of the Working Process infographic; each opens a dialog with its step's details. */
export function ProcessBadges({ badgeClass }: { badgeClass: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const { openQuote } = useQuote();
  const step = PROCESS[active];
  const action = STEP_ACTIONS[active];
  const close = () => dialogRef.current?.close();

  return (
    <>
      {PROCESS.map((s, i) => {
        const rad = (ORBIT_ANGLES[i] * Math.PI) / 180;
        return (
          <button
            key={s.title}
            type="button"
            aria-haspopup="dialog"
            aria-label={`Step ${i + 1}: ${s.title}`}
            data-step={i + 1}
            onClick={() => {
              setActive(i);
              dialogRef.current?.showModal();
            }}
            className={cn(
              badgeClass,
              "absolute size-10 -translate-1/2 cursor-pointer shadow-[0_6px_18px_rgb(2_8_24/0.45)] transition-[background-color,box-shadow,scale] duration-300 ease-smooth hover:scale-105 hover:bg-[#13306a] hover:ring-cyan-300/70 focus-visible:outline-cyan-300 sm:size-12",
            )}
            style={{ left: percent(50 + 50 * Math.cos(rad)), top: percent(50 + 50 * Math.sin(rad)) }}
          >
            <s.icon aria-hidden className="size-[18px] sm:size-5" strokeWidth={1.75} />
          </button>
        );
      })}
      <dialog
        ref={dialogRef}
        data-step={active + 1}
        aria-labelledby="process-step-title"
        aria-describedby="process-step-text"
        // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="dialog-pop m-auto w-[min(440px,calc(100vw-32px))] rounded-3xl bg-navy p-0 text-on-dark shadow-float ring-1 ring-white/10"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <span className={cn(badgeClass, "size-14")}>
              <step.icon aria-hidden className="size-6" strokeWidth={1.75} />
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 focus-visible:outline-cyan-300"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <p className="mb-1.5 text-[0.8125rem] font-semibold tracking-[0.08em] text-cyan-300 uppercase">Step {String(active + 1).padStart(2, "0")} of 06</p>
          <h3 id="process-step-title" className="mb-2 text-white">{step.title}</h3>
          <p id="process-step-text" className="m-0 leading-[1.65] text-[#a9b6d3]">{step.text}</p>
          {action && (
            <div className="mt-7">
              {"href" in action ? (
                <Link href={action.href} onClick={close} className={buttonClass({ variant: "white", size: "sm" })}>
                  {action.label} <ArrowRight aria-hidden className="size-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    close();
                    openQuote();
                  }}
                  className={buttonClass({ variant: "white", size: "sm" })}
                >
                  {action.label} <ArrowRight aria-hidden className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}

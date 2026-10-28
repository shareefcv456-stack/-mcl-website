"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { RotateCw, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * A card with a front and a back face that turns in 3D (styles: .flip in globals.css).
 *
 * The hidden face is `inert`, so keyboard and screen-reader users only ever reach the side that is showing, and both
 * faces share one grid cell so the card never changes height when it turns. The server and the first client render
 * are identical (front showing). Without JavaScript the front works on its own.
 *
 * - `trigger="button"`: a round control on the front turns the card; the same on mouse, keyboard and touch.
 * - `trigger="hover"`: a mouse turns it on hover; touch and keyboard use a full-card button on the front.
 */
export function FlipCard({
  front,
  back,
  label,
  axis = "y",
  trigger = "button",
  className,
  faceClassName,
}: {
  front: ReactNode;
  back: ReactNode;
  /** Names the card for its controls, e.g. "Air Cargo Services". */
  label: string;
  axis?: "x" | "y";
  trigger?: "button" | "hover";
  className?: string;
  faceClassName?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const frontToggle = useRef<HTMLButtonElement>(null);
  const backToggle = useRef<HTMLButtonElement>(null);
  // Move focus to the control on the face that just turned up, but only when a control turned the card.
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (flipped ? backToggle : frontToggle).current?.focus();
  }, [flipped]);

  const turn = (to: boolean) => {
    moveFocus.current = true;
    setFlipped(to);
  };

  return (
    <div
      data-flipped={flipped}
      data-axis={axis}
      className={cn("flip", className)}
      onPointerEnter={trigger === "hover" ? (e) => e.pointerType === "mouse" && setFlipped(true) : undefined}
      onPointerLeave={trigger === "hover" ? (e) => e.pointerType === "mouse" && setFlipped(false) : undefined}
    >
      <div className="flip-inner">
        <div className={cn("flip-face", faceClassName)} inert={flipped}>
          {front}
          {trigger === "button" ? (
            <button
              ref={frontToggle}
              type="button"
              aria-label={`Show details: ${label}`}
              onClick={() => turn(true)}
              className="absolute top-3 right-3 z-10 grid size-10 cursor-pointer place-items-center rounded-full bg-white/95 text-navy shadow-[0_4px_14px_rgb(11_21_51/0.18)] transition-[rotate,background-color] duration-300 ease-smooth hover:rotate-90 hover:bg-white"
            >
              <RotateCw aria-hidden className="size-[18px]" />
            </button>
          ) : (
            <button
              ref={frontToggle}
              type="button"
              aria-label={`Show details: ${label}`}
              onClick={() => turn(true)}
              className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
            />
          )}
        </div>
        <div className={cn("flip-face flip-back", faceClassName)} inert={!flipped}>
          {/* First in tab order so Tab moves on into the back face's own links. */}
          <button
            ref={backToggle}
            type="button"
            aria-label={`Back to ${label}`}
            onClick={() => turn(false)}
            className="absolute top-3 right-3 z-10 grid size-10 cursor-pointer place-items-center rounded-full border border-white/20 text-white transition-colors duration-200 hover:bg-white/10"
          >
            <X aria-hidden className="size-[18px]" />
          </button>
          {back}
        </div>
      </div>
    </div>
  );
}

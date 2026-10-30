"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

/**
 * Stacked cards that pile up as you scroll (Services page; layout in globals.css, .card-stack). Each
 * child <li> sets `--i` (its index) and holds a `.card-stack-card`. On desktop each card sticks a little lower
 * than the one before, so the next card slides up over it. This only adds polish on top of that pure-CSS stacking:
 * - `--cover` (0–1) on each card: how far the next card has come up over it, used to recede it slightly;
 * - `data-active` on the card that is currently on top;
 * - keyboard focus on a covered card scrolls back to where that card is on top, so focus is never hidden.
 * One passive scroll listener, attached only while the list is on screen and throttled to animation frames.
 * The server and first client render are identical; nothing is written until after hydration.
 */
export function StackScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const items = [...list.children] as HTMLElement[];
    const desktop = matchMedia("(min-width: 1025px)");
    const stickyTop = (li: HTMLElement) => parseFloat(getComputedStyle(li).top) || 0;
    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const tops = items.map((li) => li.getBoundingClientRect().top);
      let active = 0;
      items.forEach((li, i) => {
        if (tops[i] <= stickyTop(li) + 1) active = i;
        const next = items[i + 1];
        const cover = next ? clamp((innerHeight - tops[i + 1]) / (innerHeight - stickyTop(next))) : 0;
        li.style.setProperty("--cover", cover.toFixed(3));
      });
      items.forEach((li, i) => li.toggleAttribute("data-active", i === active));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        addEventListener("scroll", onScroll, { passive: true });
        addEventListener("resize", onScroll);
        update();
      } else {
        removeEventListener("scroll", onScroll);
        removeEventListener("resize", onScroll);
      }
    };
    const io = new IntersectionObserver(([e]) => listen(e.isIntersecting && desktop.matches));
    const reset = () => {
      listen(false);
      io.disconnect();
      items.forEach((li) => {
        li.style.removeProperty("--cover");
        li.removeAttribute("data-active");
      });
      if (desktop.matches) io.observe(list);
    };

    // Where each card sits in normal flow (sticky only shifts it visually), so we can scroll a covered card back on top.
    const onFocus = (e: FocusEvent) => {
      if (!desktop.matches) return;
      const i = items.findIndex((li) => li.contains(e.target as Node));
      const next = items[i + 1];
      if (i < 0 || !next || next.getBoundingClientRect().top >= items[i].getBoundingClientRect().bottom) return;
      let flowTop = list.getBoundingClientRect().top + scrollY;
      for (let k = 0; k <= i; k++) flowTop += parseFloat(getComputedStyle(items[k]).marginTop) + (k < i ? items[k].offsetHeight : 0);
      const smooth = matchMedia("(prefers-reduced-motion: no-preference)").matches;
      scrollTo({ top: flowTop - stickyTop(items[i]), behavior: smooth ? "smooth" : "auto" });
    };

    desktop.addEventListener("change", reset);
    list.addEventListener("focusin", onFocus);
    reset();
    return () => {
      desktop.removeEventListener("change", reset);
      list.removeEventListener("focusin", onFocus);
      io.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <ol ref={ref} className="card-stack m-0 grid list-none gap-6 p-0 min-[1025px]:block">
      {children}
    </ol>
  );
}

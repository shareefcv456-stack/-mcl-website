"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

let observer: IntersectionObserver | undefined;
const onEnter = new WeakMap<Element, (order: number) => void>();

function observe(el: Element, reveal: (order: number) => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      // `order` staggers the elements that enter together, e.g. one row of a card grid.
      let order = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        observer!.unobserve(e.target);
        onEnter.get(e.target)?.(order++);
        onEnter.delete(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  onEnter.set(el, reveal);
  observer.observe(el);
  return () => {
    observer!.unobserve(el);
    onEnter.delete(el);
  };
}

type Variant = "up" | "fade" | "stagger" | "image" | "orbit";

/**
 * Reveals its element once as it scrolls into view (styles in globals.css). "stagger" reveals each direct child as
 * it enters instead, so long grids animate row by row. The server and the first client render are identical;
 * data-reveal-state is only written after hydration. Only elements that start below the viewport are hidden, so
 * nothing visible on load flashes, and without JavaScript or with reduced motion the content simply stays visible.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  ...props
}: { as?: "div" | "ul" | "ol"; variant?: Variant; start?: number } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = variant === "stagger" ? ([...el.children] as HTMLElement[]) : [el];
    const cleanups: (() => void)[] = [];
    for (const t of targets) {
      if (t.dataset.revealState === "in") continue;
      if (reduce || t.getBoundingClientRect().top < innerHeight) {
        // A page kept by the router and shown again can still be pending here: show it rather than leave it hidden.
        if (t.dataset.revealState) t.dataset.revealState = "in";
        continue;
      }
      t.dataset.revealState = "pending";
      cleanups.push(
        observe(t, (order) => {
          t.style.setProperty("--reveal-delay", `${Math.min(order, 5) * 70}ms`);
          t.dataset.revealState = "in";
        }),
      );
    }
    return () => cleanups.forEach((c) => c());
  }, [variant]);
  return <Tag ref={ref} data-reveal={variant} {...props} />;
}

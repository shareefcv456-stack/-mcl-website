"use client";

import { useEffect, useRef } from "react";

/**
 * Counts a stat like "1000+" up from zero each time it scrolls into view: it re-arms once it has fully left the
 * viewport, so it never restarts while visible. The count waits `delay` ms so it runs while the badge is showing.
 * The server and first client render show the final value; an invisible copy holds the width so the box never
 * resizes while counting. Values on screen at load, reduced-motion users and no-JS visitors see the final value.
 */
export function CountUp({ value, duration = 1400, delay = 600 }: { value: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const match = /^(\d+)(.*)$/.exec(value);
    if (!el || !match || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Number(match[1]);
    const show = (n: number) => (el.textContent = `${n}${match[2]}`);
    let frame = 0;
    let armed = el.getBoundingClientRect().top >= innerHeight;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) {
        cancelAnimationFrame(frame);
        armed = true;
        show(0);
        return;
      }
      if (!armed) return;
      armed = false;
      const start = performance.now() + delay;
      const tick = (now: number) => {
        const t = Math.min(Math.max((now - start) / duration, 0), 1);
        show(Math.round(target * (1 - (1 - t) ** 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value, duration, delay]);
  return (
    <span className="grid">
      <span className="col-start-1 row-start-1 text-transparent">{value}</span>
      <span ref={ref} aria-hidden className="col-start-1 row-start-1">{value}</span>
    </span>
  );
}

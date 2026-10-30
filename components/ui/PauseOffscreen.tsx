"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

/**
 * A <div> that pauses the decorative animations inside it while it is off screen (or hidden): SVG timelines
 * (animateMotion and friends) via pauseAnimations(), and CSS animations via [data-paused] in globals.css. Some of
 * these, such as SVG motion paths and dash offsets, cost main-thread work on every frame, so there is no reason to run
 * them where nobody can see them. Renders the same markup on the server and the client; the attributes are only set
 * after hydration. [data-seen] is set the first time it comes into view and stays, for one-off entrances.
 */
export function PauseOffscreen(props: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute("data-paused", !e.isIntersecting);
      if (e.isIntersecting) el.setAttribute("data-seen", "");
      el.querySelectorAll("svg").forEach((svg) => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} {...props} />;
}

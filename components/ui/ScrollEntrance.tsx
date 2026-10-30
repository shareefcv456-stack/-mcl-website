"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

/**
 * Ties each [data-card] inside it to the scroll position: `--p` goes 0→1 as the card's top travels from near the bottom
 * of the viewport (95%) to a third of the way up (60%), and back again when scrolling up. CSS turns `--p` into the
 * entrance (e.g. a slide in from the card's side). The newest card that has fully arrived gets `data-active`.
 *
 * Runs only while the list is on screen and `media` matches, on one passive scroll listener throttled to animation
 * frames. Positions are read from layout (offsetTop), not from the transformed boxes, so the motion never feeds back
 * into the measurement. Until it runs, every card is fully shown (CSS defaults `--p` to 1).
 */
export function ScrollEntrance({ media, ...props }: { media: string } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-card]")];
    const mq = matchMedia(media);
    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const base = el.getBoundingClientRect().top - el.offsetTop;
      const vh = innerHeight;
      let active = -1;
      cards.forEach((card, i) => {
        // Layout position plus any static `translate` offset the CSS gives the card (e.g. a staggered column).
        const shift = parseFloat(getComputedStyle(card).translate.split(" ")[1] ?? "0") || 0;
        const top = base + card.offsetTop + shift;
        const p = clamp((vh * 0.95 - top) / (vh * 0.35));
        if (p >= 0.98) active = i;
        card.style.setProperty("--p", p.toFixed(3));
      });
      cards.forEach((card, i) => card.toggleAttribute("data-active", i === active));
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
    const io = new IntersectionObserver(([e]) => listen(e.isIntersecting && mq.matches), { rootMargin: "20% 0px" });
    const reset = () => {
      listen(false);
      io.disconnect();
      cards.forEach((card) => {
        card.style.removeProperty("--p");
        card.removeAttribute("data-active");
      });
      if (mq.matches) io.observe(el);
    };
    mq.addEventListener("change", reset);
    reset();
    return () => {
      mq.removeEventListener("change", reset);
      io.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, [media]);
  return <div ref={ref} {...props} />;
}

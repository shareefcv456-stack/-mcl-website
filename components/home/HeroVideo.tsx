"use client";

import { useEffect, useRef } from "react";

export interface HeroVideoSource {
  src: string;
  type: "video/mp4" | "video/webm";
  /** Optional media query, e.g. a lighter file for "(max-width: 767px)". */
  media?: string;
}

/**
 * Real background footage for the hero, laid over the still photo (which stays as poster and fallback).
 * Nothing downloads until the effect decides to play: not for reduced motion or Data Saver. The video is invisible
 * until it is actually playing, then fades in, so there is never a blank frame; it pauses while the hero is off screen
 * or the tab is hidden. data-playing lets the CSS stand the fallback effects down while real footage runs.
 */
export function HeroVideo({ sources, poster }: { sources: HeroVideoSource[]; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || saveData) return;

    let onScreen = true;
    const sync = () => {
      if (onScreen && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const onPlaying = () => video.setAttribute("data-playing", "");
    video.addEventListener("playing", onPlaying);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    video.load();
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("playing", onPlaying);
      video.pause();
    };
  }, []);
  return (
    <video
      ref={ref}
      data-hero-video
      aria-hidden
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className="absolute inset-0 size-full object-cover object-[60%_50%] opacity-0 transition-opacity duration-1000 ease-smooth data-playing:opacity-100"
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} media={s.media} />
      ))}
    </video>
  );
}

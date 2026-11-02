import Image from "next/image";
import type { CSSProperties } from "react";
import { Globe } from "lucide-react";
import { ArrowDot, ButtonLink, buttonClass } from "@/components/ui/Button";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { TrackingForm } from "@/components/tracking/TrackingForm";
import { HeroVideo } from "@/components/home/HeroVideo";
import { DELIVERED_STAT, HERO_VIDEO, INTRO } from "@/lib/content/home";

/** Full-screen ship hero (Hydraoo-inspired reference): headline, quote CTA, stat, intro and tracking card. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[max(720px,100svh)] overflow-hidden bg-[#0d2440] text-white">
      {/* The still: the footage's own first frame, shown at once and kept as poster and fallback (reduced motion,
          Data Saver, or if the video cannot play), so the switch to the moving video is seamless. */}
      <div className="hero-camera absolute inset-0">
        <Image
          src="/images/hero-ship7-poster.webp"
          alt="Container ship carrying MCL cargo across open sea"
          fill
          preload
          sizes="100vw"
          className="hero-backdrop object-cover object-[62%_50%]"
        />
      </div>
      {/* Real footage (HERO_VIDEO in lib/content/home.ts), played at 0.65× for a slower, more cinematic pace. */}
      {HERO_VIDEO.length > 0 && <HeroVideo sources={HERO_VIDEO} poster="/images/hero-ship7-poster.webp" playbackRate={0.65} />}
      {/* Fallback ambience for the still photo (globals.css, "Hero"). It makes the air and water around the ship move;
          the ship itself and the shape of the waves do not, which needs real footage. All transform/opacity; still
          for reduced motion; faded out while real footage is playing. */}
      <div aria-hidden className="hero-fx pointer-events-none absolute inset-0">
        {/* Cloud light: a soft copy of the photo's own sky drifting slowly over it. */}
        <div className="absolute inset-x-0 top-0 h-[48%] overflow-hidden opacity-80 mix-blend-soft-light [mask-image:linear-gradient(180deg,#000_55%,transparent_100%)]">
          <div className="hero-clouds absolute inset-y-0 -left-[15%] w-[130%] bg-[url(/images/hero-sky-soft.jpg)] bg-cover bg-center" />
        </div>
        {/* A faint band of mist along the horizon, behind the ship. */}
        <span className="hero-mist absolute inset-x-[-10%] top-[40%] h-[12%] bg-[radial-gradient(55%_50%_at_50%_50%,rgb(214_226_242/0.12),transparent)]" />
        {/* Foreground swell: real sea ripples (from work1-2.jpg, greyscale, flattened into perspective) screen-blended
            onto the water below the ship in two layers drifting at different speeds, plus a slow glint of light. */}
        <div className="absolute inset-x-0 bottom-0 h-[34%] overflow-hidden opacity-75 mix-blend-screen [mask-image:linear-gradient(180deg,transparent_0%,#000_40%,#000_100%)]">
          <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%]" />
          <div className="hero-swell absolute inset-y-0 -left-[12%] w-[150%] bg-[url(/images/hero-sea-shimmer.jpg)] bg-[length:100%_100%] opacity-55 [scale:-1_1]" />
        </div>
        <span className="hero-glint absolute bottom-[6%] left-0 h-[22%] w-[42%] bg-[radial-gradient(closest-side,rgb(165_243_252/0.13),transparent)] mix-blend-screen" />
        {/* Sea haze over the waterline. */}
        <span className="hero-haze absolute bottom-[14%] left-[22%] h-[34%] w-[70%] bg-[radial-gradient(closest-side,rgb(214_226_242/0.2),transparent)]" />
        <span className="hero-haze absolute bottom-[4%] left-[38%] h-[26%] w-[62%] bg-[radial-gradient(closest-side,rgb(214_226_242/0.14),transparent)]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(0deg,rgb(8_18_40/0.86)_0%,rgb(8_18_40/0.72)_35%,rgb(8_18_40/0.66)_58%,rgb(8_18_40/0.55)_100%)] md:bg-[linear-gradient(90deg,rgb(8_18_40/0.72)_0%,rgb(8_18_40/0.35)_45%,rgb(8_18_40/0)_70%),linear-gradient(0deg,rgb(8_18_40/0.7)_0%,rgb(8_18_40/0)_40%)]"
      />
      <div className="relative z-10 container-site flex flex-col justify-between gap-12 pt-[120px] pb-12 md:pt-[150px]">
        <div>
          <span className="mb-6 inline-flex animate-enter items-center gap-2 rounded-full border border-white/20 bg-white/10 py-[7px] pr-3.5 pl-2 text-[0.8125rem] font-medium text-[#e7eaf5] backdrop-blur">
            <span className="grid size-[22px] place-items-center rounded-full bg-brand"><Globe aria-hidden className="size-[13px]" /></span>
            Welcome to MCL
          </span>
          <h1 id="hero-title" className="mb-6 max-w-[12ch] font-medium text-white">
            {/* Each word rises in turn (.hero-word in globals.css); the text and line breaks are unchanged. */}
            <span className="hero-word [--i:0]">Your</span> <span className="hero-word [--i:1]">Global</span>{" "}
            <span className="hero-word [--i:2]">Logistics</span>{" "}
            <b className="hero-word bg-[linear-gradient(90deg,#fff,#c9ccff)] bg-clip-text font-semibold text-transparent [--i:3]">Partner.</b>
          </h1>
          <p className="-mt-2 mb-8 max-w-[40ch] animate-enter text-xl text-[#dfe4f2] [animation-delay:160ms]">
            Delivering Excellence in Land, Sea, and Air Cargo Transportation
          </p>
          <div className="flex animate-enter flex-wrap items-center gap-x-4 gap-y-3 [animation-delay:240ms]">
            <QuoteTrigger className={buttonClass({ variant: "white", arrow: true })}>
              Get a Quote <ArrowDot variant="white" />
            </QuoteTrigger>
            <ButtonLink href="/services" variant="ghost-light">Learn More</ButtonLink>
          </div>
          <div className="mt-6 inline-flex max-w-full animate-enter items-center [animation-delay:320ms] gap-2.5 rounded-full border border-white/15 bg-[rgb(8_18_40/0.35)] py-1.5 pr-4 pl-3.5 backdrop-blur-sm">
            <strong className="font-display text-[1.75rem] leading-none font-semibold">{DELIVERED_STAT.value}</strong>
            <span className="text-[0.8125rem] leading-tight text-[#e7eaf5]">Delivered<br />Goods</span>
          </div>
        </div>
        {/* The footage carries Gemini's ✦ watermark near its bottom right, and it stays visible. The video fills the
            hero (cover, 62% 50%), so on screen the mark (46px wide in the frame, centred 90.6% across) sits at
            x ≈ 0.62 × width + 0.509 × hero height. On desktop --wm-gap moves the card left only as far as it needs to
            end ~19px short of the mark (assuming the shortest hero this content allows, ~860px, or the screen if
            taller, so it is never short); it is 0 wherever the mark is off screen or already clear. The description
            column gives up that width, so the card keeps its full 440px (any narrower and the field's placeholder is
            cut off). It also always ends at least 88px from the screen's right edge on tablet and desktop, clear of
            the fixed WhatsApp button (56px, 20px in) with a 12px gap; whichever needs more room wins. Tablet: a 520px
            card on the right under the description. Phones: full width, and the field and button stack below 421px. */}
        <div
          className="grid items-end gap-8 min-[861px]:grid-cols-[minmax(0,1fr)_minmax(0,calc(440px+var(--wm-gap)))]"
          style={{ "--wm-gap": "max(0px, calc(38vw - 0.509 * max(860px, 100svh) + 48px - max(clamp(16px, 4vw, 40px), (100vw - 1200px) / 2)), calc(88px - max(clamp(16px, 4vw, 40px), (100vw - 1200px) / 2)))" } as CSSProperties}
        >
          <p className="m-0 max-w-[52ch] animate-enter text-[#F1F5F9]/80 [animation-delay:380ms]">{INTRO}</p>
          <div className="animate-enter rounded-3xl bg-white/95 p-6 text-ink shadow-float [animation-delay:440ms] min-[641px]:max-[860px]:w-full min-[641px]:max-[860px]:max-w-[520px] min-[641px]:max-[860px]:justify-self-end min-[641px]:mr-(--wm-gap)">
            <h2 className="mb-1 text-xl tracking-[-0.01em]">Track Your Order</h2>
            <p className="mb-4 text-[0.9375rem] text-muted">Get everything you need to know to track your parcel here.</p>
            <TrackingForm id="hero-tracking-id" compact buttonLabel="Track Order" />
          </div>
        </div>
      </div>
    </section>
  );
}

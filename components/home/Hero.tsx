import Image from "next/image";
import { Globe } from "lucide-react";
import { ArrowDot, ButtonLink, buttonClass } from "@/components/ui/Button";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { TrackingForm } from "@/components/tracking/TrackingForm";
import { DELIVERED_STAT, INTRO } from "@/lib/content/home";

/** Full-screen ship hero (Hydraoo-inspired reference): headline, quote CTA, stat, intro and tracking card. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[max(720px,100svh)] overflow-hidden bg-[#0d2440] text-white">
      <Image
        src="/images/hero-ship.png"
        alt="Container ship carrying MCL cargo across open sea"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[60%_50%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(0deg,rgb(8_18_40/0.85)_0%,rgb(8_18_40/0.4)_55%,rgb(8_18_40/0.55)_100%)] md:bg-[linear-gradient(90deg,rgb(8_18_40/0.72)_0%,rgb(8_18_40/0.35)_45%,rgb(8_18_40/0)_70%),linear-gradient(0deg,rgb(8_18_40/0.7)_0%,rgb(8_18_40/0)_40%)]"
      />
      <div className="relative z-10 container-site flex flex-col justify-between gap-12 pt-[120px] pb-12 md:pt-[150px]">
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-[7px] pr-3.5 pl-2 text-[0.8125rem] font-medium text-[#e7eaf5] backdrop-blur">
            <span className="grid size-[22px] place-items-center rounded-full bg-brand"><Globe aria-hidden className="size-[13px]" /></span>
            Welcome to MCL
          </span>
          <h1 id="hero-title" className="mb-6 max-w-[12ch] font-medium text-white">
            Your Global Logistics{" "}
            <b className="bg-[linear-gradient(90deg,#fff,#c9ccff)] bg-clip-text font-semibold text-transparent">Partner.</b>
          </h1>
          <p className="-mt-2 mb-8 max-w-[40ch] text-xl text-[#dfe4f2]">
            Delivering Excellence in Land, Sea, and Air Cargo Transportation
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <QuoteTrigger className={buttonClass({ variant: "white", arrow: true })}>
              Get a Quote <ArrowDot variant="white" />
            </QuoteTrigger>
            <ButtonLink href="/services" variant="ghost-light">Learn More</ButtonLink>
          </div>
          <div className="mt-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/15 bg-[rgb(8_18_40/0.35)] py-1.5 pr-4 pl-3.5 backdrop-blur-sm">
            <strong className="font-display text-[1.75rem] leading-none font-semibold">{DELIVERED_STAT.value}</strong>
            <span className="text-[0.8125rem] leading-tight text-[#e7eaf5]">Delivered<br />Goods</span>
          </div>
        </div>
        <div className="grid items-end gap-8 min-[861px]:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <p className="m-0 max-w-[52ch] text-[#F1F5F9]/80">{INTRO}</p>
          <div className="rounded-3xl bg-white/95 p-6 text-ink shadow-float">
            <h2 className="mb-1 text-xl tracking-[-0.01em]">Track Your Order</h2>
            <p className="mb-4 text-[0.9375rem] text-muted">Get everything you need to know to track your parcel here.</p>
            <TrackingForm id="hero-tracking-id" compact buttonLabel="Track Order" />
          </div>
        </div>
      </div>
    </section>
  );
}

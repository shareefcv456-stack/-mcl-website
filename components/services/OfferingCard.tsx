import Image from "next/image";
import { buttonClass } from "@/components/ui/Button";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import type { ServiceOffering } from "@/types/content";

/** Sub-service card. The live "View More" popup text becomes an inline Read more / Show less. */
export function OfferingCard({ offering }: { offering: ServiceOffering }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white">
      <div className="relative aspect-[16/10] bg-soft">
        <Image src={offering.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="m-0 text-xl">{offering.title}</h3>
        <p className="m-0 text-[0.9375rem] text-muted">{offering.summary}</p>
        {offering.description && (
          <details className="group">
            <summary className="inline-flex cursor-pointer list-none text-[0.9375rem] font-semibold text-brand [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Read more</span>
              <span className="hidden group-open:inline">Show less</span>
            </summary>
            <p className="mt-3 mb-0 text-[0.9375rem] text-muted">{offering.description}</p>
          </details>
        )}
        <QuoteTrigger category={offering.title} className={buttonClass({ variant: "ghost", size: "sm", className: "mt-auto self-start" })}>
          Request a Quote
        </QuoteTrigger>
      </div>
    </article>
  );
}

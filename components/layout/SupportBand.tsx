import Image from "next/image";
import { Phone } from "lucide-react";
import { ArrowDot, ButtonLink, buttonClass } from "@/components/ui/Button";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import { SUPPORT_TEXT } from "@/lib/content/home";
import { SITE } from "@/lib/content/site";

/** "Customer Support at MCL" band shown at the end of most inner pages on the live site. */
export function SupportBand() {
  return (
    <section className="section-y">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-3xl bg-brand text-[#dfe2ff] min-[861px]:grid-cols-[1.1fr_0.9fr]">
          <div className="p-[clamp(28px,4vw,56px)]">
            <span className="eyebrow text-[#dfe2ff]">Support</span>
            <h2 className="mb-4 text-white">Customer Support at MCL</h2>
            <p>{SUPPORT_TEXT}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QuoteTrigger className={buttonClass({ variant: "white", arrow: true })}>
                Request a Quote <ArrowDot variant="white" />
              </QuoteTrigger>
              <ButtonLink href={`tel:${SITE.phone.tel}`} variant="ghost-light">
                <Phone aria-hidden className="size-5" />{SITE.phone.label}
              </ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[498/343] min-h-[260px] min-[861px]:aspect-auto">
            <Image src="/images/cust.jpg" alt="MCL customer support agent" fill sizes="(min-width: 861px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Mail, Package, Phone } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { FaqSection } from "@/components/home/Sections";
import { ContactForm } from "@/components/forms/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { IconTile, cardClass, cardHoverClass } from "@/components/ui/Section";
import { CANADA_NOTICE, OFFICES, SITE } from "@/lib/content/site";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = pageMetadata({
  title: "Contact Us & Support",
  description: "Contact Meem Continental Logistics – offices in the UK, Calicut and Kochi, phone, email and enquiry form.",
  path: "/contact",
  image: "/images/cust.jpg",
});

const quick = [
  { href: `tel:${SITE.phone.tel}`, label: "Call Now", value: SITE.phone.label, icon: <IconTile icon={Phone} /> },
  { href: `mailto:${SITE.email}`, label: "Send Email", value: SITE.email, icon: <IconTile icon={Mail} /> },
  {
    href: SITE.whatsapp,
    label: "WhatsApp",
    value: SITE.phone.label,
    icon: <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-brand-50 text-brand"><WhatsAppIcon className="size-5" /></span>,
  },
];

/** Contact + Support (the live nav's "Support" item points here). */
export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact Us" lead="Questions, quotes or support — reach the MCL team by phone, email, WhatsApp or the form below." image="/images/cust.jpg" />
      <section className="section-y">
        <div className="container-site">
          <div className="mb-12 grid gap-6 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3">
            {quick.map((q) => (
              <a key={q.label} href={q.href} rel="noopener" className={`${cardClass} ${cardHoverClass} flex min-w-0 items-center gap-3 font-semibold text-navy`}>
                {q.icon}
                <span className="min-w-0">{q.label}<small className="block truncate font-normal text-muted">{q.value}</small></span>
              </a>
            ))}
          </div>
          <Reveal variant="stagger" className="grid items-start gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-2">
            <div>
              <span className="eyebrow">Send us email</span>
              <h2 className="mb-4">Feel free to write</h2>
              <p className="text-muted">For a quote, include cargo type, weight, dimensions and destination.</p>
              <div className="mt-6 rounded-3xl border border-line bg-white p-[clamp(20px,3vw,40px)]">
                <ContactForm />
              </div>
            </div>
            <div>
              <span className="eyebrow">Connect Us</span>
              <h2 className="mb-4">Our offices</h2>
              <div className="mt-6 grid gap-6 min-[641px]:grid-cols-2">
                {OFFICES.map((o) => (
                  <div key={o.name} className={`${cardClass} flex flex-col gap-3`}>
                    <span className="text-[0.8125rem] font-semibold tracking-[0.06em] text-brand uppercase">{o.region}</span>
                    <h3 className="m-0">{o.name}</h3>
                    <address className="text-[0.9375rem] text-muted not-italic">{o.address}</address>
                    <div className="text-[0.9375rem] font-semibold">
                      {o.phones.map((p, i) => (
                        <span key={p.tel}>{i > 0 && ", "}<a href={`tel:${p.tel}`} className="whitespace-nowrap">{p.label}</a></span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className={`${cardClass} flex flex-col gap-3 bg-soft!`}>
                  <span className="text-[0.8125rem] font-semibold tracking-[0.06em] text-brand uppercase">Coming soon</span>
                  <h3 className="m-0">Canada</h3>
                  <p className="m-0 text-[0.9375rem] text-muted">{CANADA_NOTICE}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <FaqSection eyebrow="Support">
        <ButtonLink href="/tracking" variant="ghost"><Package aria-hidden className="size-5" />Track a shipment</ButtonLink>
      </FaqSection>
    </>
  );
}

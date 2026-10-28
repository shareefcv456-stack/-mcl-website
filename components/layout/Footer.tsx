import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { FOOTER_EXPLORE, OFFICES, SITE } from "@/lib/content/site";
import { SERVICES, serviceHref } from "@/lib/content/services";

const linkClass = "text-[#dfe4f2] hover:text-white";
const headingClass = "mb-4 font-sans text-[0.9375rem] tracking-[0.06em] text-white uppercase";

export function Footer() {
  return (
    <footer className="bg-navy text-[0.9375rem] text-on-dark-muted">
      <div className="container-site">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 py-12">
          <p className="m-0 max-w-[56ch] font-display text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-snug font-medium tracking-[-0.01em] text-[#dfe4f2]">
            {SITE.tagline}
          </p>
          <ButtonLink href="/contact" variant="white" arrow>Start Booking</ButtonLink>
        </div>

        <div className="grid gap-8 py-12 min-[561px]:grid-cols-2 min-[1025px]:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
          <div>
            <Image src="/images/logo-mark.png" alt="MCL – Meem Continental Logistics" width={250} height={236}
              className="mb-4 h-[72px] w-auto rounded-[14px] bg-white px-2.5 py-1.5" />
            <ul className="m-0 grid list-none gap-2.5 p-0">
              <li>
                <a href={`tel:${SITE.phone.tel}`} className={`flex items-center gap-3 font-semibold ${linkClass}`}>
                  <Phone aria-hidden className="size-5" />
                  <span>{SITE.phone.label}<small className="block font-normal text-on-dark-muted">{SITE.phoneAlt.label}</small></span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className={`flex items-center gap-3 font-semibold break-all ${linkClass}`}>
                  <Mail aria-hidden className="size-5 shrink-0" />{SITE.email}
                </a>
              </li>
            </ul>
            <NewsletterForm />
          </div>

          <div>
            <h2 className={headingClass}>Explore</h2>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {FOOTER_EXPLORE.map((l) => <li key={l.href}><Link href={l.href} className={linkClass}>{l.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Services</h2>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {SERVICES.map((s) => <li key={s.slug}><Link href={serviceHref(s.slug)} className={linkClass}>{s.name}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Offices</h2>
            <div className="grid gap-4">
              {OFFICES.map((o) => (
                <address key={o.name} className="not-italic leading-normal">
                  <strong className="mb-0.5 block text-white">{o.region === "India" ? `India – ${o.name}, Kerala` : o.name}</strong>
                  {o.address}
                  <br />
                  {o.phones.map((p, i) => (
                    <span key={p.tel}>{i > 0 && ", "}<a href={`tel:${p.tel}`} className={`whitespace-nowrap ${linkClass}`}>{p.label}</a></span>
                  ))}
                </address>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[0.8125rem]">
          <span>© Copyright · <a href={SITE.credit.href} rel="noopener" className={linkClass}>{SITE.credit.label}</a></span>
          <div className="flex gap-2">
            {[
              { href: SITE.instagram, label: "MCL on Instagram", icon: <InstagramIcon className="size-5" /> },
              { href: SITE.whatsapp, label: "Chat with MCL on WhatsApp", icon: <WhatsAppIcon className="size-5" /> },
              { href: `tel:${SITE.phone.tel}`, label: "Call MCL", icon: <Phone aria-hidden className="size-5" /> },
            ].map((s) => (
              <a key={s.href} href={s.href} aria-label={s.label} rel="noopener" className="grid size-10 place-items-center rounded-full bg-white/10 text-[#dfe4f2] hover:bg-brand hover:text-white">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a href={SITE.whatsapp} aria-label="Chat with MCL on WhatsApp" rel="noopener"
      className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#1fa855] text-white shadow-float hover:bg-[#178a45] hover:text-white">
      <WhatsAppIcon className="size-[26px]" />
    </a>
  );
}

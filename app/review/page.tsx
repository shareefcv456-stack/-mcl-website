import { Mail, Phone } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { Testimonials } from "@/components/home/Sections";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { IconTile } from "@/components/ui/Section";
import { SITE } from "@/lib/content/site";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = pageMetadata({
  title: "Reviews",
  description: "Customer reviews and testimonials for Meem Continental Logistics. Share your feedback.",
  path: "/review",
  image: "/images/work1-1.jpg",
});

export default function ReviewPage() {
  return (
    <>
      <PageBanner title="Review Us" lead="Read what our customers say and share your own experience." image="/images/work1-1.jpg" />
      <Testimonials soft action={false} />
      <section aria-labelledby="write-title" className="section-y">
        <Reveal variant="stagger" className="container-site grid items-start gap-[clamp(32px,5vw,80px)] min-[861px]:grid-cols-2">
          <div>
            <span className="eyebrow">Review us</span>
            <h2 id="write-title" className="mb-4">Feel free to write</h2>
            <p className="text-xl text-muted">Your feedback helps us improve every shipment.</p>
            <div className="mt-6 grid gap-5">
              <a href={`tel:${SITE.phone.tel}`} className="flex items-center gap-3 font-semibold text-navy">
                <IconTile icon={Phone} /><span>Need any help?<small className="block font-normal text-muted">{SITE.phone.label}</small></span>
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 font-semibold text-navy">
                <IconTile icon={Mail} /><span className="min-w-0">Get in touch with us<small className="block truncate font-normal text-muted">{SITE.email}</small></span>
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-[clamp(20px,3vw,40px)]">
            <ReviewForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}

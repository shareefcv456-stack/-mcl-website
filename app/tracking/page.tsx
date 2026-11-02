import { Suspense } from "react";
import { connection } from "next/server";
import { Mail, Phone } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { IconTile, cardClass, cardHoverClass } from "@/components/ui/Section";
import { Alert } from "@/components/ui/Alert";
import { TrackingForm } from "@/components/tracking/TrackingForm";
import { TrackingStatus } from "@/components/tracking/TrackingStatus";
import { SITE } from "@/lib/content/site";
import { pageMetadata } from "@/lib/seo";
import { trackShipment } from "@/lib/tracking";
import { trackingIdSchema } from "@/lib/validation/forms";

export const metadata = pageMetadata({
  title: "Tracking",
  description: "Track your MCL shipment with your Shipment/AWB tracking number.",
  path: "/tracking",
});

/** Request-time part of the page: reads ?tracking_id= (the live site's GET form contract). */
async function TrackingLookup({ searchParams }: { searchParams: PageProps<"/tracking">["searchParams"] }) {
  const raw = (await searchParams).tracking_id;
  const value = typeof raw === "string" ? raw : "";
  if (!value) return <TrackingForm />;

  const parsed = trackingIdSchema.safeParse(value);
  // The IMD lookup must only run for a real request: without this, Next's prerender pass starts the fetch and then
  // abandons it, which would show up in the logs as a failed IMD call.
  if (parsed.success) await connection();
  return (
    <div className="grid gap-5">
      <TrackingForm key={value} defaultValue={value} />
      {parsed.success ? (
        <TrackingStatus trackingId={parsed.data} result={await trackShipment(parsed.data)} />
      ) : (
        <Alert tone="error" title="That tracking number doesn't look right.">{parsed.error.issues[0].message}</Alert>
      )}
    </div>
  );
}

export default function TrackingPage(props: PageProps<"/tracking">) {
  return (
    <>
      <PageBanner title="Tracking" lead="Enter Your Shipment/AWB Tracking Number." image="/images/work1-4.jpg" />
      <section className="section-y">
        <div className="container-site max-w-[808px]">
          <div className="grid gap-5 rounded-3xl border border-line bg-white p-[clamp(20px,3vw,40px)] shadow-[0_1px_2px_rgb(11_21_51/0.06)]">
            <div>
              <h2 className="mb-1 text-[clamp(1.5rem,1.2rem+1vw,2rem)]">Track Your Order</h2>
              <p className="m-0 text-muted">Get everything you need to know to track your parcel here.</p>
            </div>
            <Suspense fallback={<TrackingForm />}>
              <TrackingLookup searchParams={props.searchParams} />
            </Suspense>
          </div>
          {/* grid-cols-1 caps the single column at the container width, so the long email truncates instead of pushing
              the cards past the screen edge on small phones. */}
          <div className="mt-6 grid grid-cols-1 gap-6 min-[641px]:grid-cols-2">
            <a href={`tel:${SITE.phone.tel}`} className={`${cardClass} ${cardHoverClass} flex items-center gap-3 font-semibold text-navy`}>
              <IconTile icon={Phone} />
              <span>Call support<small className="block font-normal text-muted">{SITE.phone.label}</small></span>
            </a>
            <a href={`mailto:${SITE.email}`} className={`${cardClass} ${cardHoverClass} flex items-center gap-3 font-semibold text-navy`}>
              <IconTile icon={Mail} />
              <span className="min-w-0">Email us<small className="block truncate font-normal text-muted">{SITE.email}</small></span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

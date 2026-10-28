import { Alert } from "@/components/ui/Alert";
import { SITE } from "@/lib/content/site";
import type { TrackingResult } from "@/lib/tracking";

/** Renders a TrackingResult. Never shows shipment data unless a real provider returned it. */
export function TrackingStatus({ trackingId, result }: { trackingId: string; result: TrackingResult }) {
  const contact = (
    <>
      For an update now, call <a href={`tel:${SITE.phone.tel}`}>{SITE.phone.label}</a> or{" "}
      <a href={SITE.whatsapp} rel="noopener">message us on WhatsApp</a> with your tracking number.
    </>
  );

  switch (result.status) {
    case "not_connected":
      return (
        <Alert tone="warn" title={`Tracking number received: ${trackingId}`}>
          Live shipment status isn&apos;t connected to this website yet, so no results can be shown. {contact}
        </Alert>
      );
    case "not_found":
      return (
        <Alert tone="error" title={`No shipment found for ${trackingId}`}>
          Check the number on your booking receipt and try again. {contact}
        </Alert>
      );
    case "found":
      return (
        <div role="status" className="rounded-2xl bg-soft p-5">
          <p className="m-0 text-sm text-muted">Shipment {result.trackingId}</p>
          <p className="mb-4 font-display text-xl font-semibold text-navy">{result.currentStatus}</p>
          <ol className="m-0 grid list-none gap-3 p-0">
            {result.events.map((ev) => (
              <li key={ev.at + ev.description} className="border-l-2 border-brand pl-3 text-[0.9375rem]">
                <time dateTime={ev.at} className="block text-xs text-muted">{new Date(ev.at).toLocaleString("en-GB")}</time>
                {ev.description}
                {ev.location && <span className="text-muted"> · {ev.location}</span>}
              </li>
            ))}
          </ol>
        </div>
      );
  }
}

import { Alert } from "@/components/ui/Alert";
import { SITE } from "@/lib/content/site";
import type { TrackingResult } from "@/lib/tracking";

const DETAIL_LABELS = [
  ["origin", "Origin"],
  ["destination", "Destination"],
  ["bookingDate", "Booking date"],
  ["deliveryDate", "Delivery date"],
] as const;

/** Renders a TrackingResult. Shows only what the carrier returned; never fills in or guesses shipment data. */
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
    case "unavailable":
      return (
        <Alert tone="warn" title="Tracking is temporarily unavailable">
          We couldn&apos;t reach the tracking service just now, so your shipment status can&apos;t be shown. Please try again
          in a few minutes. {contact}
        </Alert>
      );
    case "found": {
      const details = DETAIL_LABELS.filter(([key]) => result.details[key]);
      return (
        <div role="status" className="grid gap-5 rounded-2xl bg-soft p-5">
          <div>
            <p className="m-0 text-sm text-muted">
              Shipment {result.trackingId}
              {result.forwardingNo && <> · Forwarding no. {result.forwardingNo}</>}
            </p>
            <p className="m-0 font-display text-xl font-semibold text-navy">{result.details.status ?? "Status not provided by the carrier"}</p>
          </div>
          {details.length > 0 && (
            <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-3 min-[480px]:grid-cols-2">
              {details.map(([key, label]) => (
                <div key={key}>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="m-0 font-medium text-navy">{result.details[key]}</dd>
                </div>
              ))}
            </dl>
          )}
          {result.events.length > 0 ? (
            <div>
              <h3 className="mb-3 text-base">Tracking history</h3>
              <ol className="m-0 grid list-none gap-3 p-0">
                {result.events.map((ev, i) => (
                  <li key={i} className="border-l-2 border-brand pl-3 text-[0.9375rem]">
                    <span className="block text-xs text-muted">{ev.at}</span>
                    {ev.description}
                    {ev.location && <span className="text-muted"> · {ev.location}</span>}
                    {ev.remark && <span className="block text-sm text-muted">{ev.remark}</span>}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="m-0 text-sm text-muted">No tracking events have been recorded for this shipment yet.</p>
          )}
        </div>
      );
    }
  }
}

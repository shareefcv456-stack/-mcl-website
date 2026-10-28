/**
 * Shipment tracking integration point.
 *
 * No tracking data source is connected yet. When MCL chooses a provider, implement
 * `TrackingProvider` for it (reading credentials from `TRACKING_API_URL` / `TRACKING_API_KEY`,
 * server-side only) and return it from `getTrackingProvider()`. Until then every lookup
 * returns `not_connected` — the UI says so instead of inventing results.
 */

export interface TrackingEvent {
  /** ISO date-time. */
  at: string;
  location?: string;
  description: string;
}

export type TrackingResult =
  | { status: "not_connected" }
  | { status: "not_found" }
  | { status: "found"; trackingId: string; currentStatus: string; events: TrackingEvent[] };

export interface TrackingProvider {
  lookup(trackingId: string): Promise<TrackingResult>;
}

export function getTrackingProvider(): TrackingProvider | null {
  return null;
}

export async function trackShipment(trackingId: string): Promise<TrackingResult> {
  const provider = getTrackingProvider();
  return provider ? provider.lookup(trackingId) : { status: "not_connected" };
}

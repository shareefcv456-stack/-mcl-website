"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { trackingIdSchema } from "@/lib/validation/forms";

/**
 * Shipment / AWB number form. Like the live site it submits `GET /tracking?tracking_id=…`,
 * so it still works without JavaScript; with JS it validates first and navigates client-side.
 */
export function TrackingForm({
  id = "tracking_id",
  defaultValue = "",
  compact,
  buttonLabel = "Tracking",
}: {
  id?: string;
  defaultValue?: string;
  /** Hero variant: visually hidden label, no hint. */
  compact?: boolean;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  // The lookup runs on the server while /tracking renders; the transition stays pending until the result is ready,
  // which drives the loading state and stops repeat submissions in the meantime.
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const raw = new FormData(e.currentTarget).get("tracking_id");
    const parsed = trackingIdSchema.safeParse(typeof raw === "string" ? raw : "");
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      e.currentTarget.querySelector("input")?.focus();
      return;
    }
    setError(undefined);
    startTransition(() => router.push(`/tracking?tracking_id=${encodeURIComponent(parsed.data)}`));
  }

  return (
    <form action="/tracking" method="get" noValidate onSubmit={onSubmit} aria-busy={pending}>
      <Field
        id={id}
        label="Shipment / AWB tracking number"
        required={!compact}
        labelClassName={compact ? "sr-only" : undefined}
        hint={compact ? undefined : "You'll find this number on your booking receipt."}
        error={error}
      >
        <div className="flex gap-2 max-[420px]:flex-col">
          <input
            id={id}
            name="tracking_id"
            defaultValue={defaultValue}
            maxLength={100}
            autoComplete="off"
            placeholder={compact ? "Shipment / AWB number" : "e.g. MCL12345678"}
            aria-invalid={!!error}
            aria-describedby={describedBy(id, { hint: !compact, error })}
            onChange={() => error && setError(undefined)}
            className={inputClass}
          />
          <Button type="submit" disabled={pending} aria-disabled={pending}>
            {!compact && <Package aria-hidden className="size-5" />}
            {pending ? "Tracking…" : buttonLabel}
          </Button>
        </div>
      </Field>
    </form>
  );
}

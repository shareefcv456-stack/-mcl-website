"use client";

import { useState, type BaseSyntheticEvent } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Alert } from "@/components/ui/Alert";
import type { FormResponse } from "@/lib/forms/response";
import { SITE } from "@/lib/content/site";
import { HONEYPOT_FIELD } from "@/lib/validation/forms";

const NETWORK_ERROR: FormResponse = {
  ok: false,
  code: "DELIVERY_FAILED",
  message: "We couldn't reach the server. Check your connection and try again.",
};

async function post(url: string, body: Record<string, unknown> | FormData): Promise<FormResponse> {
  try {
    const isForm = body instanceof FormData;
    const res = await fetch(url, {
      method: "POST",
      headers: isForm ? undefined : { "Content-Type": "application/json" },
      body: isForm ? body : JSON.stringify(body),
    });
    return (await res.json()) as FormResponse;
  } catch {
    return NETWORK_ERROR;
  }
}

/** Reads the hidden spam-trap value from the submitted form element. */
function honeypotValue(event?: BaseSyntheticEvent) {
  const el = (event?.target as HTMLFormElement | undefined)?.elements?.namedItem(HONEYPOT_FIELD);
  return el instanceof HTMLInputElement ? el.value : "";
}

/**
 * Posts validated form data and maps the API response onto the form:
 * field errors go back to React Hook Form, everything else becomes `result` for <FormOutcome>.
 */
export function useFormSubmit<T extends FieldValues>(form: UseFormReturn<T>, url: string) {
  const [result, setResult] = useState<FormResponse | null>(null);

  async function submit(data: Record<string, unknown> | FormData, event?: BaseSyntheticEvent) {
    setResult(null);
    const trap = honeypotValue(event);
    if (data instanceof FormData) data.set(HONEYPOT_FIELD, trap);
    else data = { ...data, [HONEYPOT_FIELD]: trap };

    const res = await post(url, data);
    if (!res.ok && res.fieldErrors) {
      for (const [name, messages] of Object.entries(res.fieldErrors)) {
        if (messages?.[0]) form.setError(name as Path<T>, { message: messages[0] }, { shouldFocus: true });
      }
    }
    setResult(res);
  }

  return { result, submit, clear: () => setResult(null) };
}

export function FormOutcome({ result }: { result: FormResponse | null }) {
  if (!result) return null;
  if (result.ok) return <Alert tone="success" title="Thank you — your message has been sent." />;
  if (result.code === "DELIVERY_NOT_CONFIGURED") {
    return (
      <Alert tone="warn" title="Not sent — online delivery isn't set up yet.">
        Your details passed validation, but this website can&apos;t deliver messages until an email provider is
        configured. Please call <a href={`tel:${SITE.phone.tel}`}>{SITE.phone.label}</a> or email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </Alert>
    );
  }
  return <Alert tone="error" title={result.message} />;
}

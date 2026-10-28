"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field, Honeypot, describedBy, inputClass } from "@/components/ui/Field";
import { contactSchema, type ContactInput } from "@/lib/validation/forms";
import { FormOutcome, useFormSubmit } from "./useFormSubmit";

const FIELDS: { name: keyof ContactInput; label: string; type?: string; autoComplete?: string; placeholder: string }[] = [
  { name: "name", label: "First name", autoComplete: "given-name", placeholder: "First name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "name@example.com" },
  { name: "subject", label: "Subject", placeholder: "e.g. Air cargo to UK" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", placeholder: "+91" },
];

/**
 * The live site's contact form (name, email, subject, phone, message — all required).
 * Used on /contact and inside the Get a Quote dialog (posting to /api/quote).
 */
export function ContactForm({
  endpoint = "/api/contact",
  idPrefix = "contact",
  subject,
}: {
  endpoint?: "/api/contact" | "/api/quote";
  idPrefix?: string;
  /** Prefills the subject line, e.g. "Quote: Medicine and Pharma". */
  subject?: string;
}) {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: subject ?? "", phone: "", message: "" },
  });
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = form;
  const { result, submit, clear } = useFormSubmit(form, endpoint);

  useEffect(() => {
    if (subject) setValue("subject", subject);
  }, [subject, setValue]);

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form noValidate onSubmit={handleSubmit((data, e) => submit(data, e))} className="relative grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <Field key={f.name} id={id(f.name)} label={f.label} required error={errors[f.name]?.message}>
            <input
              id={id(f.name)}
              type={f.type ?? "text"}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              aria-invalid={!!errors[f.name]}
              aria-describedby={describedBy(id(f.name), { error: errors[f.name] })}
              className={inputClass}
              {...register(f.name)}
            />
          </Field>
        ))}
      </div>
      <Field id={id("message")} label="Message" required error={errors.message?.message}>
        <textarea
          id={id("message")}
          rows={5}
          placeholder="Cargo type, weight, dimensions, origin and destination"
          aria-invalid={!!errors.message}
          aria-describedby={describedBy(id("message"), { error: errors.message })}
          className={`${inputClass} min-h-[132px] resize-y`}
          {...register("message")}
        />
      </Field>
      <Honeypot name="form_botcheck" />
      {Object.keys(errors).length > 0 && !result && (
        <FormOutcome result={{ ok: false, code: "VALIDATION", message: "Please fix the highlighted fields." }} />
      )}
      <FormOutcome result={result} />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" arrow disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
        <Button variant="ghost" onClick={() => { reset(); clear(); }}>
          Reset
        </Button>
      </div>
    </form>
  );
}

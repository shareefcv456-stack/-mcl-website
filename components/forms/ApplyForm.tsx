"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Field, Honeypot, describedBy, inputClass } from "@/components/ui/Field";
import { applicationSchema, CV_EXTENSIONS, cvError } from "@/lib/validation/forms";
import { FormOutcome, useFormSubmit } from "./useFormSubmit";

// Client schema = shared text-field schema + the CV file check the server also runs.
const schema = applicationSchema.extend({
  cv: z.custom<FileList>().superRefine((files, ctx) => {
    const message = cvError(files?.[0]);
    if (message) ctx.addIssue({ code: "custom", message });
  }),
});
type ApplyValues = z.input<typeof schema>;

/** Job application form (position, name, email, phone, CV) — fields as on the live job page. */
export function ApplyForm({ position }: { position: string }) {
  const form = useForm<ApplyValues>({
    resolver: zodResolver(schema),
    defaultValues: { position, applicant_name: "", email: "", phone: "" },
  });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;
  const { result, submit, clear } = useFormSubmit(form, "/api/careers/apply");

  const onValid = handleSubmit((data, e) => {
    const body = new FormData();
    body.set("position", data.position);
    body.set("applicant_name", data.applicant_name);
    body.set("email", data.email);
    body.set("phone", data.phone);
    body.set("cv", (data.cv as FileList)[0]);
    return submit(body, e);
  });

  const text = (name: "applicant_name" | "email" | "phone", label: string, type: string, autoComplete: string, placeholder: string) => (
    <Field id={`apply-${name}`} label={label} required error={errors[name]?.message}>
      <input id={`apply-${name}`} type={type} autoComplete={autoComplete} placeholder={placeholder} className={inputClass}
        aria-invalid={!!errors[name]} aria-describedby={describedBy(`apply-${name}`, { error: errors[name] })} {...register(name)} />
    </Field>
  );

  return (
    <form noValidate onSubmit={onValid} className="relative grid gap-4">
      <input type="hidden" {...register("position")} />
      {errors.position && <FormOutcome result={{ ok: false, code: "VALIDATION", message: errors.position.message ?? "" }} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {text("applicant_name", "Applicant name", "text", "name", "Enter your name")}
        {text("email", "Email", "email", "email", "name@example.com")}
        {text("phone", "Phone", "tel", "tel", "+91")}
        <Field id="apply-cv" label="CV" required hint={`${CV_EXTENSIONS.join(", ").toUpperCase()} · max 5 MB`} error={errors.cv?.message}>
          <input id="apply-cv" type="file" accept={CV_EXTENSIONS.join(",")} className={`${inputClass} py-2.5`}
            aria-invalid={!!errors.cv} aria-describedby={describedBy("apply-cv", { hint: true, error: errors.cv })} {...register("cv")} />
        </Field>
      </div>
      <Honeypot name="form_botcheck" />
      <FormOutcome result={result} />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" arrow disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit"}</Button>
        <Button variant="ghost" onClick={() => { reset(); clear(); }}>Reset</Button>
      </div>
    </form>
  );
}

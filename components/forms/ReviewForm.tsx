"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field, Honeypot, describedBy, inputClass } from "@/components/ui/Field";
import { reviewSchema, type ReviewInput } from "@/lib/validation/forms";
import { FormOutcome, useFormSubmit } from "./useFormSubmit";

/** The live site's "Review us" form: name, email, comment — all required. */
export function ReviewForm() {
  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { name: "", email: "", message: "" },
  });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;
  const { result, submit, clear } = useFormSubmit(form, "/api/review");

  return (
    <form noValidate onSubmit={handleSubmit((data, e) => submit(data, e))} className="relative grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="review-name" label="Name" required error={errors.name?.message}>
          <input id="review-name" autoComplete="name" placeholder="Your name" className={inputClass}
            aria-invalid={!!errors.name} aria-describedby={describedBy("review-name", { error: errors.name })} {...register("name")} />
        </Field>
        <Field id="review-email" label="Email" required error={errors.email?.message}>
          <input id="review-email" type="email" autoComplete="email" placeholder="name@example.com" className={inputClass}
            aria-invalid={!!errors.email} aria-describedby={describedBy("review-email", { error: errors.email })} {...register("email")} />
        </Field>
      </div>
      <Field id="review-message" label="Your comment" required error={errors.message?.message}>
        <textarea id="review-message" rows={5} placeholder="Tell us about your experience" className={`${inputClass} min-h-[132px] resize-y`}
          aria-invalid={!!errors.message} aria-describedby={describedBy("review-message", { error: errors.message })} {...register("message")} />
      </Field>
      <Honeypot name="form_botcheck" />
      <FormOutcome result={result} />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" arrow disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send your feedback"}</Button>
        <Button variant="ghost" onClick={() => { reset(); clear(); }}>Reset</Button>
      </div>
    </form>
  );
}

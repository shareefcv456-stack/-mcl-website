"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field, Honeypot, describedBy, inputClass } from "@/components/ui/Field";
import { cn } from "@/lib/utils/cn";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/forms";
import { FormOutcome, useFormSubmit } from "./useFormSubmit";

export function NewsletterForm() {
  const form = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema), defaultValues: { email: "" } });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;
  const { result, submit } = useFormSubmit(form, "/api/newsletter");

  return (
    <form noValidate onSubmit={handleSubmit((data, e) => submit(data, e))} className="relative mt-6 grid gap-3">
      <Field
        id="newsletter-email"
        label="Newsletter"
        labelClassName="text-white"
        error={errors.email?.message}
        className="[&_[id$=-err]]:text-[#ff9a9a]"
      >
        {/* Hint sits above the input, as in the original footer. */}
        <span id="newsletter-email-hint" className="text-[0.8125rem] text-on-dark-muted">Subscribe our newsletter to get our latest update &amp; news</span>
        <div className="flex gap-2 max-[420px]:flex-col">
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("newsletter-email", { hint: true, error: errors.email })}
            className={cn(inputClass, "min-h-11 border-white/20 bg-white/5 text-white placeholder:text-[#8f99b8] hover:border-white/40")}
            {...register("email")}
          />
          <Button type="submit" size="sm" disabled={isSubmitting}>{isSubmitting ? "…" : "Subscribe"}</Button>
        </div>
      </Field>
      <Honeypot name="form_botcheck" />
      <FormOutcome result={result} />
    </form>
  );
}

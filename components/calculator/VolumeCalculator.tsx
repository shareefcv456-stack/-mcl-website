"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { dimensionsSchema, formatKg, volumetricWeightKg, type Dimensions, type DimensionsInput } from "@/lib/calculator";
import { cn } from "@/lib/utils/cn";

const DIMENSIONS = [
  { name: "length", label: "Length (cm)" },
  { name: "width", label: "Width (cm)" },
  { name: "height", label: "Height (cm)" },
] as const;

/** Volumetric weight calculator — L × W × H ÷ 5000, cm → kg, as on the live site. */
export function VolumeCalculator() {
  const [weight, setWeight] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DimensionsInput, unknown, Dimensions>({
    resolver: zodResolver(dimensionsSchema),
    defaultValues: { length: "", width: "", height: "" },
  });

  return (
    <form
      noValidate
      aria-label="Volumetric weight calculator"
      onSubmit={handleSubmit((d) => setWeight(volumetricWeightKg(d)), () => setWeight(null))}
      className="grid gap-4 rounded-3xl border border-line bg-white p-[clamp(20px,3vw,40px)] text-ink shadow-[0_1px_2px_rgb(11_21_51/0.06)]"
    >
      <div className="grid gap-3 min-[421px]:grid-cols-3">
        {DIMENSIONS.map(({ name, label }) => (
          <Field key={name} id={`calc-${name}`} label={label} error={errors[name]?.message}>
            <input
              id={`calc-${name}`}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              aria-invalid={!!errors[name]}
              aria-describedby={describedBy(`calc-${name}`, { error: errors[name] })}
              className={inputClass}
              {...register(name, { onChange: () => setWeight(null) })}
            />
          </Field>
        ))}
      </div>
      <div
        aria-live="polite"
        className={cn(
          "flex items-center justify-between rounded-2xl border border-dashed px-[18px] py-4 transition-colors duration-300 ease-smooth",
          weight === null ? "border-[#cfd4e2] bg-soft" : "border-transparent bg-success-50",
        )}
      >
        <span className="text-[0.9375rem] text-muted">Volumetric Weight</span>
        <output htmlFor="calc-length calc-width calc-height" className={cn("font-display text-[1.75rem] leading-none font-semibold", weight === null ? "text-navy" : "text-success")}>
          <span key={weight ?? "empty"} className={cn("inline-block", weight !== null && "animate-result-in")}>{weight === null ? "—" : formatKg(weight)}</span>
        </output>
      </div>
      <p className="m-0 text-[0.8125rem] text-muted">
        Formula: Length × Width × Height ÷ 5000. This is an estimate of volumetric weight only, not a shipping rate.
      </p>
      <div className="flex gap-3">
        <Button type="submit" block>Calculate</Button>
        <Button variant="ghost" onClick={() => { reset(); setWeight(null); }}>Reset</Button>
      </div>
    </form>
  );
}

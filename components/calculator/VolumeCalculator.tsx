"use client";

import { useState } from "react";
import { RotateCcw, Ruler } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field, describedBy, inputClass } from "@/components/ui/Field";
import { IconTile } from "@/components/ui/Section";
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
      className="relative grid gap-5 overflow-hidden rounded-[28px] border border-line bg-white p-[clamp(20px,3vw,32px)] pt-[clamp(24px,3vw,36px)] text-ink shadow-[0_1px_2px_rgb(11_21_51/0.05),0_24px_56px_-36px_rgb(11_21_51/0.35)]"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <IconTile icon={Ruler} className="size-11" />
          <span>
            <span className="block font-display text-[1.0625rem] font-semibold text-navy">Shipment dimensions</span>
            <span className="text-[0.875rem] text-muted">Enter each side in centimetres</span>
          </span>
        </span>
        <span aria-hidden className="hidden shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-[0.8125rem] font-semibold text-brand tabular-nums min-[421px]:inline">
          L × W × H ÷ 5000
        </span>
      </div>
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
          "flex items-center justify-between gap-4 rounded-2xl border px-5 py-[18px] transition-colors duration-300 ease-smooth",
          weight === null ? "border-dashed border-[#cfd4e2] bg-soft" : "border-success/20 bg-success-50",
        )}
      >
        <span className="text-[0.8125rem] font-semibold tracking-[0.06em] text-muted uppercase">Volumetric Weight</span>
        <output htmlFor="calc-length calc-width calc-height" className={cn("font-display text-[2rem] leading-none font-semibold tabular-nums", weight === null ? "text-navy" : "text-success")}>
          <span key={weight ?? "empty"} className={cn("inline-block", weight !== null && "animate-result-in")}>{weight === null ? "—" : formatKg(weight)}</span>
        </output>
      </div>
      <p className="m-0 text-[0.8125rem] text-muted">
        Formula: Length × Width × Height ÷ 5000. This is an estimate of volumetric weight only, not a shipping rate.
      </p>
      <div className="flex gap-3">
        <Button type="submit" block>Calculate</Button>
        <Button variant="ghost" onClick={() => { reset(); setWeight(null); }}>
          <RotateCcw aria-hidden className="size-4" />Reset
        </Button>
      </div>
    </form>
  );
}

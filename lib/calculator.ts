import { z } from "zod";

/** Dimensional factor used by the live site's calculator for centimetres → kilograms. */
export const VOLUMETRIC_DIVISOR_CM = 5000;

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

/** Volumetric weight in kg for dimensions in cm: L × W × H ÷ 5000 (same formula as the live site). */
export function volumetricWeightKg({ length, width, height }: Dimensions, divisor = VOLUMETRIC_DIVISOR_CM): number {
  for (const [name, v] of Object.entries({ length, width, height })) {
    if (!Number.isFinite(v) || v <= 0) throw new RangeError(`${name} must be a positive number`);
  }
  return (length * width * height) / divisor;
}

/** The live site shows the result with `toFixed(2)`. */
export const formatKg = (kg: number) => `${kg.toFixed(2)} kg`;

const dimension = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter the ${label}.`)
    .regex(/^(\d+\.?\d*|\.\d+)$/, "Use numbers only, e.g. 42.5")
    .transform(Number)
    .refine((n) => n > 0, "Enter a value greater than 0.");

/** Form input (strings, cm) → validated numeric dimensions. */
export const dimensionsSchema = z.object({
  length: dimension("length"),
  width: dimension("width"),
  height: dimension("height"),
});
export type DimensionsInput = z.input<typeof dimensionsSchema>;

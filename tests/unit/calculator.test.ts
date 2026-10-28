import { describe, expect, it } from "vitest";
import { dimensionsSchema, formatKg, volumetricWeightKg } from "@/lib/calculator";

describe("volumetricWeightKg", () => {
  it("matches the live site's formula: L × W × H ÷ 5000", () => {
    expect(volumetricWeightKg({ length: 50, width: 40, height: 30 })).toBe(12);
    expect(formatKg(volumetricWeightKg({ length: 50, width: 40, height: 30 }))).toBe("12.00 kg");
  });

  it("handles decimals and rounds the display to 2 places like toFixed(2)", () => {
    expect(formatKg(volumetricWeightKg({ length: 10.5, width: 20, height: 30 }))).toBe("1.26 kg");
    expect(formatKg(volumetricWeightKg({ length: 1, width: 1, height: 1 }))).toBe("0.00 kg");
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])("rejects %s", (bad) => {
    expect(() => volumetricWeightKg({ length: bad, width: 1, height: 1 })).toThrow(RangeError);
  });
});

describe("dimensionsSchema", () => {
  it("parses decimal strings into numbers", () => {
    expect(dimensionsSchema.parse({ length: "50", width: " 40.5 ", height: ".5" })).toEqual({ length: 50, width: 40.5, height: 0.5 });
  });

  it.each([
    ["", "Enter the length."],
    ["abc", "Use numbers only, e.g. 42.5"],
    ["-5", "Use numbers only, e.g. 42.5"],
    ["1e3", "Use numbers only, e.g. 42.5"],
    ["0", "Enter a value greater than 0."],
  ])("rejects %j with a clear message", (length, message) => {
    const r = dimensionsSchema.safeParse({ length, width: "1", height: "1" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe(message);
  });
});

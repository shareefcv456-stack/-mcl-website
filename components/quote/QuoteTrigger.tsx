"use client";

import type { ComponentProps } from "react";
import { useQuote } from "./QuoteProvider";

/**
 * A link to /contact (the live site's quote destination) that opens the quote dialog instead
 * when JavaScript is available. Pass `category` to prefill the subject line.
 */
export function QuoteTrigger({ category, onClick, ...props }: Omit<ComponentProps<"a">, "href"> & { category?: string }) {
  const { openQuote } = useQuote();
  return (
    <a
      href="/contact"
      aria-haspopup="dialog"
      onClick={(e) => {
        onClick?.(e);
        e.preventDefault();
        openQuote(category);
      }}
      {...props}
    />
  );
}

"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";

interface QuoteContextValue {
  /** Opens the quote dialog, optionally prefilling the subject with a shipment category. */
  openQuote: (category?: string) => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}

/**
 * Get a Quote dialog. Uses the native <dialog> element: showModal() traps focus, makes the page
 * inert, closes on Escape and returns focus to the trigger when closed.
 */
export function QuoteProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [subject, setSubject] = useState<string>();

  const openQuote = useCallback((category?: string) => {
    if (category) setSubject(`Quote: ${category}`);
    dialogRef.current?.showModal();
  }, []);

  return (
    <QuoteContext.Provider value={{ openQuote }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="quote-title"
        aria-describedby="quote-desc"
        // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto max-h-[calc(100dvh-32px)] w-[min(640px,calc(100vw-32px))] rounded-3xl p-0 text-ink shadow-float"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h2 id="quote-title" className="mb-1 text-2xl">Get a Quote</h2>
            <p id="quote-desc" className="m-0 text-[0.9375rem] text-muted">
              Share your shipment details — cargo type, weight, dimensions and destination help us give an accurate quote.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-white text-navy hover:bg-soft"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="p-6">
          <ContactForm endpoint="/api/quote" idPrefix="quote" subject={subject} />
        </div>
      </dialog>
    </QuoteContext.Provider>
  );
}

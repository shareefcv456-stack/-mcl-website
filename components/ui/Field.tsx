import type { ComponentProps, ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const inputClass = cn(
  "w-full min-h-12 rounded-[10px] border border-[#cfd4e2] bg-white px-4 py-3 text-[1.0625rem] leading-snug text-navy transition",
  "placeholder:text-[#8b93ab] hover:border-[#aab1c6]",
  "focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand-100",
  "aria-invalid:border-danger aria-invalid:bg-[#fffafa] aria-invalid:focus:ring-danger-50",
);

/**
 * Label + control + hint + error. The control must carry `id={id}`, `aria-invalid` and
 * `aria-describedby={describedBy(id, …)}` so the message is announced.
 */
export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
  labelClassName,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-[0.9375rem] font-semibold text-navy", labelClassName)}>
        {label}
        {required && <span aria-hidden className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
      {hint && <span id={`${id}-hint`} className="text-[0.8125rem] text-muted">{hint}</span>}
      {error && (
        <span id={`${id}-err`} className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-danger">
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {error}
        </span>
      )}
    </div>
  );
}

/** aria-describedby value for a Field's control. */
export const describedBy = (id: string, { hint, error }: { hint?: boolean; error?: unknown }) =>
  [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;

/** Hidden spam trap. Real visitors never see or fill it. */
export function Honeypot(props: ComponentProps<"input">) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}

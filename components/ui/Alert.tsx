import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AlertTone = "success" | "error" | "info" | "warn";

const TONES: Record<AlertTone, string> = {
  success: "bg-success-50 text-success",
  error: "bg-danger-50 text-danger",
  info: "bg-brand-50 text-brand-700",
  warn: "bg-warn-50 text-warn",
};
const ICONS = { success: CircleCheck, error: CircleAlert, info: Info, warn: Info };

export function Alert({ tone, title, children, className }: { tone: AlertTone; title: string; children?: ReactNode; className?: string }) {
  const Icon = ICONS[tone];
  return (
    <div role="status" className={cn("flex items-start gap-3 rounded-[10px] px-4 py-3.5 text-[0.9375rem] leading-normal", TONES[tone], className)}>
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div>
        <strong className="block">{title}</strong>
        {children}
      </div>
    </div>
  );
}

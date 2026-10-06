import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  // dodatkowa informacja w nagłówku sekcji (np. status tłumaczeń)
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FormSection({
  title,
  aside,
  className,
  children,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-lg border bg-card p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

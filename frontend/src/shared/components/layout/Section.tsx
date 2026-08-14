import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sectionVariants = cva("", {
  variants: {
    spacing: {
      none: "",
      compact: "py-8",
      standard: "py-14",
      roomy: "py-20",
    },
    tone: {
      transparent: "",
      white: "bg-white",
      muted: "bg-gray-100",
      subtle: "bg-gray-50",
      brand: "bg-brand-dark text-brand-light",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    spacing: "standard",
    tone: "transparent",
    align: "left",
  },
});

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
} & VariantProps<typeof sectionVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as">;

export function Section<T extends ElementType = "section">({
  as,
  spacing,
  tone,
  align,
  className,
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      className={cn(sectionVariants({ spacing, tone, align }), className)}
      {...props}
    />
  );
}

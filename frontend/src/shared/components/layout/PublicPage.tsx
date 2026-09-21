import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const publicPageVariants = cva("w-full", {
  variants: {
    tone: {
      white: "bg-white",
      muted: "bg-gray-100",
      brand: "bg-brand-dark text-brand-light",
    },
    minHeight: {
      screen: "min-h-screen",
      none: "",
    },
  },
  defaultVariants: {
    tone: "white",
    minHeight: "none",
  },
});

type PublicPageProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof publicPageVariants>;

export function PublicPage({
  tone,
  minHeight,
  className,
  ...props
}: PublicPageProps) {
  return (
    <div
      className={cn(publicPageVariants({ tone, minHeight }), className)}
      {...props}
    />
  );
}

import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      hero: "text-xl md:text-2xl",
    },
    tone: {
      dark: "text-gray-900",
      body: "text-gray-700",
      muted: "text-gray-600",
      white: "text-white",
      brandLight: "text-brand-light",
      inherit: "",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    leading: {
      normal: "",
      relaxed: "leading-relaxed",
    },
    spacingBottom: {
      none: "",
      xs: "mb-1",
      sm: "mb-2",
      md: "mb-3",
      lg: "mb-4",
      xl: "mb-6",
    },
  },
  defaultVariants: {
    size: "base",
    tone: "body",
    weight: "normal",
    align: "left",
    leading: "normal",
    spacingBottom: "none",
  },
});

type TextProps<T extends ElementType = "p"> = {
  as?: T;
} & VariantProps<typeof textVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "color">;

export function Text<T extends ElementType = "p">({
  as,
  size,
  tone,
  weight,
  align,
  leading,
  spacingBottom,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(
        textVariants({ size, tone, weight, align, leading, spacingBottom }),
        className,
      )}
      {...props}
    />
  );
}

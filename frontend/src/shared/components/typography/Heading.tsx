import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("", {
  variants: {
    size: {
      card: "text-lg",
      body: "text-xl",
      modal: "text-2xl",
      section: "text-2xl md:text-3xl",
      page: "text-3xl md:text-4xl",
      feature: "text-4xl md:text-5xl",
      display: "text-5xl md:text-6xl",
    },
    tone: {
      dark: "text-gray-900",
      white: "text-white",
      brandLight: "text-brand-light",
      inherit: "",
    },
    weight: {
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    spacingBottom: {
      none: "",
      xs: "mb-2",
      sm: "mb-3",
      md: "mb-4",
      lg: "mb-5",
      xl: "mb-10",
      "2xl": "mb-12",
      "3xl": "mb-14",
    },
    tracking: {
      normal: "",
      tight: "tracking-tight",
    },
  },
  defaultVariants: {
    size: "body",
    tone: "dark",
    weight: "bold",
    align: "left",
    spacingBottom: "none",
    tracking: "normal",
  },
});

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
} & VariantProps<typeof headingVariants> &
  Omit<ComponentPropsWithoutRef<"h1">, "color">;

export function Heading({
  level,
  size,
  tone,
  weight,
  align,
  spacingBottom,
  tracking,
  className,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as ElementType;

  return (
    <Component
      className={cn(
        headingVariants({
          size,
          tone,
          weight,
          align,
          spacingBottom,
          tracking,
        }),
        className,
      )}
      {...props}
    />
  );
}

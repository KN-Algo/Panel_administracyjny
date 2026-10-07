import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const surfaceVariants = cva("", {
  variants: {
    tone: {
      transparent: "",
      white: "bg-white",
      subtle: "bg-gray-50/50",
      brand: "bg-brand-dark text-white",
    },
    radius: {
      none: "",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
      xl: "p-8",
      featured: "px-8 py-6",
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
    },
    border: {
      none: "",
      subtle: "border border-gray-100",
      white: "border-[3px] border-white",
      black: "border-[3px] border-black",
    },
    interaction: {
      none: "",
      liftStrong:
        "transition-all duration-500 [@media(hover:hover)]:hover:-translate-y-2 [@media(hover:hover)]:hover:shadow-2xl active:-translate-y-1 active:shadow-xl",
      liftGentle:
        "transition-all duration-300 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:bg-gray-100/50 [@media(hover:hover)]:hover:border-gray-200 [@media(hover:hover)]:hover:shadow-md active:-translate-y-0.5",
      rise: "transition-transform duration-300 [@media(hover:hover)]:hover:-translate-y-2 active:-translate-y-1",
      scale: "transition-all duration-300 [@media(hover:hover)]:hover:scale-[1.02] active:scale-[1.02]",
    },
    overflow: {
      visible: "",
      hidden: "overflow-hidden",
    },
    position: {
      static: "",
      relative: "relative",
    },
    width: {
      auto: "",
      full: "w-full",
    },
    cursor: {
      auto: "",
      pointer: "cursor-pointer",
      default: "cursor-default",
    },
    group: {
      true: "group",
      false: "",
    },
    textAlign: {
      inherit: "",
      left: "text-left",
      center: "text-center",
    },
  },
  defaultVariants: {
    tone: "transparent",
    radius: "none",
    padding: "none",
    shadow: "none",
    border: "none",
    interaction: "none",
    overflow: "visible",
    position: "static",
    width: "auto",
    cursor: "auto",
    group: false,
    textAlign: "inherit",
  },
});

type SurfaceProps<T extends ElementType = "div"> = {
  as?: T;
} & VariantProps<typeof surfaceVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "color">;

export function Surface<T extends ElementType = "div">({
  as,
  tone,
  radius,
  padding,
  shadow,
  border,
  interaction,
  overflow,
  position,
  width,
  cursor,
  group,
  textAlign,
  className,
  ...props
}: SurfaceProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        surfaceVariants({
          tone,
          radius,
          padding,
          shadow,
          border,
          interaction,
          overflow,
          position,
          width,
          cursor,
          group,
          textAlign,
        }),
        className,
      )}
      {...props}
    />
  );
}

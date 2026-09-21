import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconFrameVariants = cva("flex items-center justify-center", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-9 w-9",
      lg: "h-16 w-16",
    },
    radius: {
      md: "rounded-md",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    tone: {
      neutral: "bg-gray-100",
      glass:
        "border border-white/25 bg-white/10 text-white/90 shadow-member-action backdrop-blur-sm",
      brand: "bg-brand-dark text-white",
    },
    placement: {
      inline: "",
      cardCorner: "absolute bottom-3 right-3 z-10",
    },
    interaction: {
      none: "",
      playful:
        "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white/20",
      nudge:
        "transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-white/16 group-hover:text-white",
    },
  },
  defaultVariants: {
    size: "md",
    radius: "full",
    tone: "neutral",
    placement: "inline",
    interaction: "none",
  },
});

type IconFrameProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof iconFrameVariants>;

export function IconFrame({
  size,
  radius,
  tone,
  placement,
  interaction,
  className,
  ...props
}: IconFrameProps) {
  return (
    <div
      className={cn(
        iconFrameVariants({ size, radius, tone, placement, interaction }),
        className,
      )}
      {...props}
    />
  );
}

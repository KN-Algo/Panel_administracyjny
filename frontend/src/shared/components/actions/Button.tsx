import type { ComponentPropsWithoutRef } from "react";
import * as Slot from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      appearance: {
        brand:
          "bg-brand-dark text-white font-medium hover:bg-brand-dark-hover",
        light:
          "bg-brand-light text-brand-dark font-bold hover:bg-white",
        outlineOnDark:
          "border-2 border-brand-light-40 bg-transparent text-brand-light font-bold hover:border-brand-light",
        text: "text-brand-dark font-semibold hover:underline",
        subtle: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        disclosure:
          "w-full justify-between rounded-lg bg-brand-dark px-6 py-4 text-white transition-all duration-300 hover:bg-brand-dark-hover hover:shadow-lg",
      },
      size: {
        inline: "",
        sm: "rounded-md px-3 py-1.5 text-sm",
        md: "rounded-lg px-4 py-2 text-sm",
        lg: "rounded-lg px-6 py-3 text-base",
      },
      motion: {
        none: "",
        languageActive:
          "uppercase tracking-wider transition-all duration-300 shadow-lg shadow-brand-light-30 scale-105",
        languageIdle:
          "uppercase tracking-wider transition-all duration-300 hover:shadow-md hover:shadow-brand-light-20 hover:scale-105",
      },
    },
    defaultVariants: {
      appearance: "brand",
      size: "md",
      motion: "none",
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  asChild = false,
  appearance,
  size,
  motion,
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      className={cn(buttonVariants({ appearance, size, motion }), className)}
      {...props}
    />
  );
}

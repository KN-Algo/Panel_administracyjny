import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const contentContainerVariants = cva("container mx-auto px-4", {
  variants: {
    size: {
      default: "",
      narrow: "max-w-3xl",
      article: "max-w-4xl",
      content: "max-w-5xl",
      wide: "max-w-7xl",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type ContentContainerProps<T extends ElementType = "div"> = {
  as?: T;
} & VariantProps<typeof contentContainerVariants> &
  Omit<ComponentPropsWithoutRef<T>, "as">;

export function ContentContainer<T extends ElementType = "div">({
  as,
  size,
  align,
  className,
  ...props
}: ContentContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(contentContainerVariants({ size, align }), className)}
      {...props}
    />
  );
}

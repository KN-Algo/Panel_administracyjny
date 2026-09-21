import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

interface DialogProps
  extends Omit<
    ComponentProps<typeof DialogPrimitive.Content>,
    "children" | "onOpenAutoFocus" | "onCloseAutoFocus" | "title"
  > {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  overlayClassName?: string;
  titleClassName?: string;
}

/**
 * Shared modal foundation for both public and administrative frontends.
 *
 * It owns dialog semantics, focus management, Escape handling and page scroll
 * locking. Feature components only provide their content and visual styling.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  overlayClassName,
  titleClassName,
  className,
  onEscapeKeyDown,
  onPointerDownOutside,
  ...contentProps
}: DialogProps) {
  const openerRef = useRef<HTMLElement | null>(null);

  const restoreOpenerFocus = () => {
    const opener = openerRef.current;
    if (opener?.isConnected) opener.focus();
    openerRef.current = null;
  };

  useEffect(() => {
    if (!open) restoreOpenerFocus();
    return () => {
      if (open) restoreOpenerFocus();
    };
  }, [open]);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn("fixed inset-0 z-50 bg-black/60", overlayClassName)}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn("fixed z-50", className)}
          onOpenAutoFocus={() => {
            if (document.activeElement instanceof HTMLElement) {
              openerRef.current = document.activeElement;
            }
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restoreOpenerFocus();
          }}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={(event) => {
            onPointerDownOutside?.(event);
            if (!closeOnBackdrop || event.defaultPrevented) {
              event.preventDefault();
            }
          }}
          {...contentProps}
        >
          <DialogPrimitive.Title className={cn("sr-only", titleClassName)}>
            {title}
          </DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

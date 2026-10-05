import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";

export function useMobileNavigation(desktopFocusRef: RefObject<HTMLAnchorElement | null>) {
  const location = useLocation();
  const [openLocation, setOpenLocation] = useState<typeof location | null>(null);
  const open = openLocation === location;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const desktopTarget = desktopFocusRef.current;
    const trigger = triggerRef.current;
    panel?.querySelector("a")?.focus({ preventScroll: true });
    return () => {
      if (panel?.contains(document.activeElement)) {
        const target = window.matchMedia("(min-width: 768px)").matches
          ? desktopTarget : trigger;
        target?.focus({ preventScroll: true });
      }
    };
  }, [open, desktopFocusRef]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setOpenLocation(null);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenLocation(null);
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const resize = () => {
      if (desktop.matches) {
        desktopFocusRef.current?.focus({ preventScroll: true });
        setOpenLocation(null);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [open, desktopFocusRef]);

  return {
    open, location, triggerRef, panelRef,
    close: () => setOpenLocation(null),
    toggle: () => setOpenLocation(open ? null : location),
  };
}

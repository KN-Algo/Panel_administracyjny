import { useLayoutEffect, useRef, type RefObject } from "react";

export function useElementHeight<T extends HTMLElement>(onHeightChange: (height: number) => void): RefObject<T | null> {
  const elementRef = useRef<T>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateHeight = () => onHeightChange(element.getBoundingClientRect().height);
    const observer = new ResizeObserver(updateHeight);
    updateHeight();
    observer.observe(element);

    return () => observer.disconnect();
  }, [onHeightChange]);

  return elementRef;
}

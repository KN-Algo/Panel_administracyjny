import { useRef } from "react";
import type { TouchEvent } from "react";

interface UseSwipeOptions {
  minDistance?: number;
}

export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  { minDistance = 50 }: UseSwipeOptions = {},
) {
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) < minDistance) return;
    if (delta < 0) onSwipeLeft();
    else onSwipeRight();
  };

  return { onTouchStart, onTouchEnd };
}

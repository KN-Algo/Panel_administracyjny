import { useCallback, useEffect, useState } from "react";

export type GalleryDirection = "next" | "previous";

const normalizeIndex = (index: number, itemCount: number) => {
  if (itemCount <= 0) return 0;
  return ((index % itemCount) + itemCount) % itemCount;
};

export function useGalleryNavigation(itemCount: number, initialIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    normalizeIndex(initialIndex, itemCount),
  );

  useEffect(() => {
    setCurrentIndex(normalizeIndex(initialIndex, itemCount));
  }, [initialIndex, itemCount]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(normalizeIndex(index, itemCount));
    },
    [itemCount],
  );

  const move = useCallback(
    (direction: GalleryDirection) => {
      if (itemCount <= 1) return;

      setCurrentIndex((index) =>
        normalizeIndex(index + (direction === "next" ? 1 : -1), itemCount),
      );
    },
    [itemCount],
  );

  const next = useCallback(() => move("next"), [move]);
  const previous = useCallback(() => move("previous"), [move]);

  return {
    currentIndex,
    goTo,
    next,
    previous,
  };
}

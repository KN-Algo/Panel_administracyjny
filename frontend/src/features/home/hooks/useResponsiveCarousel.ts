import { useCallback, useEffect, useRef, useState } from "react";

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

const getItemsPerSlide = (): number => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth >= DESKTOP_BREAKPOINT) return 3;
  if (window.innerWidth >= TABLET_BREAKPOINT) return 2;
  return 1;
};

export interface ResponsiveCarouselState {
  currentSlide: number;
  itemsPerSlide: number;
  totalSlides: number;
  isTransitioning: boolean;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (index: number) => void;
  completeTransition: () => void;
}

export function useResponsiveCarousel(
  itemCount: number,
): ResponsiveCarouselState {
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pendingSlide, setPendingSlide] = useState<number | null>(null);
  const currentSlideRef = useRef(currentSlide);
  const itemsPerSlideRef = useRef(itemsPerSlide);
  const pendingSlideRef = useRef<number | null>(null);

  const totalSlides = Math.ceil(itemCount / itemsPerSlide);
  const visibleSlide = totalSlides > 0 ? Math.min(currentSlide, totalSlides - 1) : 0;
  const isTransitioning = pendingSlide !== null;

  const updateCurrentSlide = useCallback((slide: number) => {
    currentSlideRef.current = slide;
    setCurrentSlide(slide);
  }, []);

  const cancelTransition = useCallback(() => {
    pendingSlideRef.current = null;
    setPendingSlide(null);
  }, []);

  const completeTransition = useCallback(() => {
    const nextSlide = pendingSlideRef.current;
    if (nextSlide === null) return;

    updateCurrentSlide(nextSlide);
    pendingSlideRef.current = null;
    setPendingSlide(null);
  }, [updateCurrentSlide]);

  useEffect(() => {
    const handleResize = () => {
      const nextItemsPerSlide = getItemsPerSlide();
      const previousItemsPerSlide = itemsPerSlideRef.current;

      if (nextItemsPerSlide === previousItemsPerSlide) return;

      const firstVisibleItem =
        currentSlideRef.current * previousItemsPerSlide;
      const nextSlide = Math.floor(firstVisibleItem / nextItemsPerSlide);

      cancelTransition();
      itemsPerSlideRef.current = nextItemsPerSlide;
      setItemsPerSlide(nextItemsPerSlide);
      updateCurrentSlide(nextSlide);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cancelTransition, updateCurrentSlide]);

  const changeSlide = useCallback(
    (newSlide: number) => {
      if (pendingSlideRef.current !== null || totalSlides === 0) return;

      const normalizedSlide =
        ((newSlide % totalSlides) + totalSlides) % totalSlides;
      if (normalizedSlide === currentSlideRef.current) return;

      pendingSlideRef.current = normalizedSlide;
      setPendingSlide(normalizedSlide);
    },
    [totalSlides],
  );

  const nextSlide = useCallback(
    () => changeSlide(visibleSlide + 1),
    [changeSlide, visibleSlide],
  );

  const previousSlide = useCallback(
    () => changeSlide(visibleSlide - 1),
    [changeSlide, visibleSlide],
  );

  return {
    currentSlide: visibleSlide,
    itemsPerSlide,
    totalSlides,
    isTransitioning,
    nextSlide,
    previousSlide,
    goToSlide: changeSlide,
    completeTransition,
  };
}

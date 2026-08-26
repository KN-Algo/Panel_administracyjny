import { useCallback, useEffect, useRef, useState } from "react";

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;
const DEFAULT_TRANSITION_DURATION = 300;

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
}

export function useResponsiveCarousel(
  itemCount: number,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
): ResponsiveCarouselState {
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSlideRef = useRef(currentSlide);
  const itemsPerSlideRef = useRef(itemsPerSlide);
  const isTransitioningRef = useRef(isTransitioning);

  const totalSlides = Math.ceil(itemCount / itemsPerSlide);
  const visibleSlide = totalSlides > 0 ? Math.min(currentSlide, totalSlides - 1) : 0;

  const updateCurrentSlide = useCallback((slide: number) => {
    currentSlideRef.current = slide;
    setCurrentSlide(slide);
  }, []);

  const finishTransition = useCallback(() => {
    if (transitionTimer.current !== null) {
      clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
    isTransitioningRef.current = false;
    setIsTransitioning(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const nextItemsPerSlide = getItemsPerSlide();
      const previousItemsPerSlide = itemsPerSlideRef.current;

      if (nextItemsPerSlide === previousItemsPerSlide) return;

      const firstVisibleItem =
        currentSlideRef.current * previousItemsPerSlide;
      const nextSlide = Math.floor(firstVisibleItem / nextItemsPerSlide);

      finishTransition();
      itemsPerSlideRef.current = nextItemsPerSlide;
      setItemsPerSlide(nextItemsPerSlide);
      updateCurrentSlide(nextSlide);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [finishTransition, updateCurrentSlide]);

  useEffect(
    () => () => {
      if (transitionTimer.current !== null) {
        clearTimeout(transitionTimer.current);
      }
    },
    [],
  );

  const changeSlide = useCallback(
    (newSlide: number) => {
      if (isTransitioningRef.current || totalSlides === 0) return;

      const normalizedSlide =
        ((newSlide % totalSlides) + totalSlides) % totalSlides;

      isTransitioningRef.current = true;
      setIsTransitioning(true);
      transitionTimer.current = setTimeout(() => {
        updateCurrentSlide(normalizedSlide);
        transitionTimer.current = null;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }, transitionDuration);
    },
    [totalSlides, transitionDuration, updateCurrentSlide],
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
  };
}

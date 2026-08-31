import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { Event } from "@/types";

type GalleryDirection = "next" | "prev";
type SlideDirection = "left" | "right";

export interface EventGalleryController {
  isMounted: boolean;
  isOpen: boolean;
  images: string[];
  currentSlide: number;
  slideDirection: SlideDirection;
  isTransitioning: boolean;
  open: (images: string[], startIndex?: number) => void;
  close: () => void;
  changeSlide: (direction: GalleryDirection) => void;
}

export function useEventDialog(events: Event[]) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasOpenedFromState = useRef(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isGalleryMounted, setIsGalleryMounted] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] =
    useState<SlideDirection>("right");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const openEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    window.setTimeout(() => setIsEventOpen(true), 10);
  }, []);

  const closeEvent = useCallback(() => {
    setIsEventOpen(false);
    window.setTimeout(() => setSelectedEvent(null), 300);
  }, []);

  const openGallery = useCallback((images: string[], startIndex = 0) => {
    setGalleryImages(
      images.map((image) => image.replace("../img/", "/img/")),
    );
    setCurrentSlide(startIndex);
    setIsGalleryMounted(true);
    window.setTimeout(() => setIsGalleryOpen(true), 10);
  }, []);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    window.setTimeout(() => {
      setIsGalleryMounted(false);
      setGalleryImages([]);
      setCurrentSlide(0);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const changeGallerySlide = useCallback(
    (direction: GalleryDirection) => {
      if (isTransitioning) return;

      setSlideDirection(direction === "next" ? "right" : "left");
      setIsTransitioning(true);
      window.setTimeout(() => {
        setCurrentSlide((previousSlide) =>
          direction === "next"
            ? (previousSlide + 1) % galleryImages.length
            : previousSlide === 0
              ? galleryImages.length - 1
              : previousSlide - 1,
        );
        setIsTransitioning(false);
      }, 300);
    },
    [galleryImages.length, isTransitioning],
  );

  useEffect(() => {
    const state = location.state as { eventId?: string } | null;
    if (!state?.eventId || hasOpenedFromState.current) return;

    const event = events.find((candidate) => candidate.id === state.eventId);
    if (!event) return;

    hasOpenedFromState.current = true;
    window.setTimeout(() => {
      setSelectedEvent(event);
      setIsEventOpen(true);
    }, 10);
    navigate(location.pathname, { replace: true, state: {} });
  }, [events, location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!isGalleryMounted) return;

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") closeGallery();
      if (keyboardEvent.key === "ArrowLeft") changeGallerySlide("prev");
      if (keyboardEvent.key === "ArrowRight") changeGallerySlide("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeGallerySlide, closeGallery, isGalleryMounted]);

  useEffect(() => {
    if (!selectedEvent || isGalleryMounted) return;

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") closeEvent();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeEvent, isGalleryMounted, selectedEvent]);

  const gallery: EventGalleryController = {
    isMounted: isGalleryMounted,
    isOpen: isGalleryOpen,
    images: galleryImages,
    currentSlide,
    slideDirection,
    isTransitioning,
    open: openGallery,
    close: closeGallery,
    changeSlide: changeGallerySlide,
  };

  return {
    selectedEvent,
    isEventOpen,
    openEvent,
    closeEvent,
    gallery,
  };
}

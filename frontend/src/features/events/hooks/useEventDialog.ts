import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { Event } from "@/types";

export interface EventGalleryController {
  isOpen: boolean;
  initialIndex: number;
  open: (startIndex?: number) => void;
  close: () => void;
}

export function useEventDialog(events: Event[]) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasOpenedFromState = useRef(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const openEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    window.setTimeout(() => setIsEventOpen(true), 10);
  }, []);

  const closeEvent = useCallback(() => {
    setIsEventOpen(false);
    window.setTimeout(() => setSelectedEvent(null), 300);
  }, []);

  const openGallery = useCallback((startIndex = 0) => {
    setGalleryInitialIndex(startIndex);
    setIsGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

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

  const gallery: EventGalleryController = {
    isOpen: isGalleryOpen,
    initialIndex: galleryInitialIndex,
    open: openGallery,
    close: closeGallery,
  };

  return {
    selectedEvent,
    isEventOpen,
    openEvent,
    closeEvent,
    gallery,
  };
}

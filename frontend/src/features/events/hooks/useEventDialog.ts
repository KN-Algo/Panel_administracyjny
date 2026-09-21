import { useCallback, useEffect, useState } from "react";
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
  const eventIdFromRoute = (
    location.state as { eventId?: string } | null
  )?.eventId;
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    eventIdFromRoute ?? null,
  );
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? null;

  const openEvent = useCallback((event: Event) => {
    setSelectedEventId(event.id);
  }, []);

  const closeEvent = useCallback(() => {
    setIsGalleryOpen(false);
    setSelectedEventId(null);
  }, []);

  const openGallery = useCallback((startIndex = 0) => {
    setGalleryInitialIndex(startIndex);
    setIsGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  useEffect(() => {
    if (!eventIdFromRoute) return;
    navigate(location.pathname, { replace: true, state: {} });
  }, [eventIdFromRoute, location.pathname, navigate]);

  const gallery: EventGalleryController = {
    isOpen: isGalleryOpen,
    initialIndex: galleryInitialIndex,
    open: openGallery,
    close: closeGallery,
  };

  return {
    selectedEvent,
    isEventOpen: selectedEvent !== null,
    openEvent,
    closeEvent,
    gallery,
  };
}

import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import eventsDataPl from "@/data/events_pl.json";
import eventsDataEn from "@/data/events_en.json";
import eventsDataDe from "@/data/events_de.json";
import type { Event } from "@/types";

export default function EventsPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isGalleryAnimating, setIsGalleryAnimating] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);
  const hasOpenedFromState = useRef(false);

  const events = useMemo(() => {
    const lang = i18n.language;
    if (lang === "en") return eventsDataEn as Event[];
    if (lang === "de") return eventsDataDe as Event[];
    return eventsDataPl as Event[];
  }, [i18n.language]);

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setTimeout(() => setIsModalAnimating(true), 10);
  };

  // Auto-open event if eventId is passed via state (only once)
  useEffect(() => {
    const state = location.state as { eventId?: string } | null;
    if (state?.eventId && !hasOpenedFromState.current) {
      const event = events.find((e) => e.id === state.eventId);
      if (event) {
        hasOpenedFromState.current = true;
        // Clear state to prevent reopening
        navigate(location.pathname, { replace: true, state: {} });
        // setTimeout avoids calling setState synchronously inside effect
        setTimeout(() => openEventModal(event), 0);
      }
    }
  }, [location.state, events, location.pathname, navigate]);

  const closeEventModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const openGallery = (images: string[], startIndex: number = 0) => {
    const processedImages = images.map((img) =>
      img.replace("../img/", "/img/"),
    );
    setGalleryImages(processedImages);
    setCurrentGallerySlide(startIndex);
    setGalleryOpen(true);
    setTimeout(() => setIsGalleryAnimating(true), 10);
  };

  const closeGallery = () => {
    setIsGalleryAnimating(false);
    setTimeout(() => {
      setGalleryOpen(false);
      setGalleryImages([]);
      setCurrentGallerySlide(0);
    }, 300);
  };

  const handleGallerySlideChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentGallerySlide((currentGallerySlide + 1) % galleryImages.length);
    } else {
      setCurrentGallerySlide(
        currentGallerySlide === 0
          ? galleryImages.length - 1
          : currentGallerySlide - 1,
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* Header Section */}
      <section className="py-14 text-center bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t("events.page_title")}
          </h1>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
                onClick={() => openEventModal(event)}
              >
                <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={event.thumbnail.replace("../img/", "/img/")}
                    alt={event.title}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {formatDate(event.date)}
                  </p>
                  <button className="text-[#000424] font-semibold hover:underline">
                    Zobacz więcej →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-300 ${
            isModalAnimating ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8 transition-all duration-300 ${
              isModalAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900 pr-8">
                {selectedEvent.title}
              </h2>
              <button
                onClick={closeEventModal}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div
                dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                className="text-gray-700 leading-relaxed mb-6"
              />

              {/* Gallery Thumbnails */}
              {selectedEvent.images && selectedEvent.images.length > 0 && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedEvent.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openGallery(selectedEvent.images, index)}
                      >
                        <img
                          src={image.replace("../img/", "/img/")}
                          alt={`${selectedEvent.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Gallery Modal */}
      {galleryOpen && (
        <div
          className={`fixed inset-0 bg-black/95 z-60 flex items-center justify-center transition-opacity duration-300 ${
            isGalleryAnimating ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Close button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image carousel */}
          <div
            className={`relative w-full h-full flex items-center justify-center p-8 transition-all duration-300 ${
              isGalleryAnimating
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
          >
            <img
              src={galleryImages[currentGallerySlide]}
              alt={`Gallery image ${currentGallerySlide + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {galleryImages.length > 1 && (
              <>
                {/* Left arrow */}
                <button
                  onClick={() => handleGallerySlideChange("prev")}
                  className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Right arrow */}
                <button
                  onClick={() => handleGallerySlideChange("next")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                  {currentGallerySlide + 1} / {galleryImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

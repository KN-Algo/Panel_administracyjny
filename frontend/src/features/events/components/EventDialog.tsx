import DOMPurify from "dompurify";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button, Heading } from "@/shared";
import type { Event } from "@/types";
import type { EventGalleryController } from "../hooks/useEventDialog";

interface EventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  gallery: EventGalleryController;
}

export default function EventDialog({
  event,
  isOpen,
  onClose,
  gallery,
}: EventDialogProps) {
  return (
    <>
      {event && (
        <div
          className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8 transition-all duration-300 ${
              isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <Heading level={2} size="modal" className="pr-8">
                {event.title}
              </Heading>
              <Button
                type="button"
                appearance="subtle"
                size="inline"
                onClick={onClose}
                aria-label="Close event"
                className="rounded-full p-2 flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(event.description),
                }}
                className="text-gray-700 leading-relaxed mb-6"
              />

              {event.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => gallery.open(event.images, index)}
                    >
                      <img
                        src={image.replace("../img/", "/img/")}
                        alt={`${event.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gallery.isMounted && (
        <div
          className={`fixed inset-0 bg-black/95 z-[60] flex items-center justify-center transition-opacity duration-300 ${
            gallery.isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={gallery.close}
            aria-label="Close gallery"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                key={gallery.currentSlide}
                src={gallery.images[gallery.currentSlide]}
                alt={`Gallery image ${gallery.currentSlide + 1}`}
                className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-500 ease-out ${
                  gallery.isTransitioning
                    ? gallery.slideDirection === "right"
                      ? "opacity-0 translate-x-20"
                      : "opacity-0 -translate-x-20"
                    : "opacity-100 translate-x-0"
                }`}
              />
            </div>

            {gallery.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => gallery.changeSlide("prev")}
                  disabled={gallery.isTransitioning}
                  aria-label="Previous image"
                  className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  onClick={() => gallery.changeSlide("next")}
                  disabled={gallery.isTransitioning}
                  aria-label="Next image"
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                  {gallery.currentSlide + 1} / {gallery.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

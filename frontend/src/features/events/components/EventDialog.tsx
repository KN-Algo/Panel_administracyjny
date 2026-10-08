import DOMPurify from "dompurify";
import { X } from "lucide-react";

import { Button, Dialog, Heading, ImageGalleryDialog } from "@/shared";
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
        <Dialog
          open={isOpen}
          onClose={onClose}
          title={event.title}
          overlayClassName="backdrop-blur-sm"
          className="event-dialog left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl"
        >
          <div className="event-dialog__header sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <Heading level={2} size="modal" className="event-dialog__title pr-8">
              {event.title}
            </Heading>
            <Button
              type="button"
              appearance="subtle"
              size="inline"
              onClick={onClose}
              aria-label="Close event"
              className="event-dialog__close rounded-full p-2 flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="event-dialog__body p-6">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(event.description),
              }}
              className="event-dialog__description text-gray-700 leading-relaxed mb-6 break-words hyphens-auto [&_*]:max-w-full [&_img]:h-auto"
            />

            {event.images.length > 0 && (
              <div className="event-dialog__gallery mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className="event-dialog__thumbnail aspect-square overflow-hidden rounded-lg cursor-pointer [@media(hover:hover)]:hover:opacity-80 active:opacity-80 transition-opacity"
                    onClick={() => gallery.open(index)}
                  >
                    <img
                      src={image.replace("../img/", "/img/")}
                      alt={`${event.title} - ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Dialog>
      )}

      {event && (
        <ImageGalleryDialog
          open={gallery.isOpen}
          onClose={gallery.close}
          title={event.title}
          images={event.images}
          initialIndex={gallery.initialIndex}
        />
      )}
    </>
  );
}

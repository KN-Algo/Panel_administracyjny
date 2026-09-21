import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useGalleryNavigation } from "@/shared/hooks/useGalleryNavigation";
import { Dialog } from "../overlay/Dialog";

interface ImageGalleryDialogProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  title: string;
}

const getImageSource = (image: string) => image.replace("../img/", "/img/");

export function ImageGalleryDialog({
  images,
  initialIndex = 0,
  open,
  onClose,
  title,
}: ImageGalleryDialogProps) {
  const { t } = useTranslation();
  const { currentIndex, next, previous } = useGalleryNavigation(
    images.length,
    initialIndex,
  );

  useEffect(() => {
    if (!open || images.length <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, next, open, previous]);

  if (images.length === 0) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      closeOnBackdrop={false}
      overlayClassName="z-[60] bg-black/95"
      className="inset-0 z-[60] flex items-center justify-center"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("common.close")}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
      >
        <X className="h-8 w-8" aria-hidden="true" />
      </button>

      <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-8">
        <img
          src={getImageSource(images[currentIndex])}
          alt={`${title} - ${currentIndex + 1}`}
          className="max-h-full max-w-full rounded-lg object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label={t("common.previous")}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-black shadow-lg transition-transform hover:scale-110 sm:left-8 sm:p-4"
            >
              <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t("common.next")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-black shadow-lg transition-transform hover:scale-110 sm:right-8 sm:p-4"
            >
              <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            </button>
          </>
        )}

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </Dialog>
  );
}

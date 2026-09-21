import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ImageGalleryDialog, useGalleryNavigation } from "@/shared";

interface ProjectImageCarouselProps {
  images: string[];
  title: string;
}

const getImageSource = (image: string) => image.replace("../img/", "/img/");

export default function ProjectImageCarousel({
  images,
  title,
}: ProjectImageCarouselProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const { currentIndex, goTo, next, previous } = useGalleryNavigation(
    images.length,
  );

  const openModal = (startIndex = 0) => {
    setModalInitialIndex(startIndex);
    setIsModalOpen(true);
  };

  const modal = (
    <ImageGalleryDialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={title}
      images={images}
      initialIndex={modalInitialIndex}
    />
  );

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          className="relative flex w-full justify-center"
          onClick={() => openModal()}
        >
          <img
            src={getImageSource(images[0])}
            alt={title}
            className="max-w-full max-h-[600px] rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </button>
        {modal}
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="flex justify-center items-center h-[500px] bg-gray-50 rounded-2xl">
          <button
            type="button"
            className="flex h-full w-full items-center justify-center"
            onClick={() => openModal(currentIndex)}
          >
            <img
              src={getImageSource(images[currentIndex])}
              alt={`${title} - ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
            />
          </button>
        </div>

        <button
          type="button"
          onClick={previous}
          aria-label={t("common.previous")}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark rounded-full p-3 shadow-lg transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label={t("common.next")}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark rounded-full p-3 shadow-lg transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goTo(index)}
              aria-label={`${title} - ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-brand-dark w-8"
                  : "bg-gray-300 w-2 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
      {modal}
    </>
  );
}

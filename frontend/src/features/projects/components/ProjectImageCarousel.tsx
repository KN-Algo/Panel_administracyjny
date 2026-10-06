import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ImageGalleryDialog, useGalleryNavigation, useSwipe } from "@/shared";

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

  const swipe = useSwipe(next, previous);

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
            className="project-carousel__single-image max-w-full max-h-[600px] rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </button>
        {modal}
      </>
    );
  }

  const dots = images.map((_, index) => (
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
  ));

  return (
    <>
      <div className="project-carousel__frame relative">
        <div
          className="project-carousel__image-box flex justify-center items-center h-[500px] bg-gray-50 rounded-2xl overflow-hidden"
          {...swipe}
        >
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

        {/* Desktop arrows — absolute on sides, hidden on mobile via CSS */}
        <div className="project-carousel__desktop-arrows">
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
        </div>

        {/* Desktop dots — hidden on mobile via CSS */}
        <div className="project-carousel__dots flex justify-center gap-2 mt-4">
          {dots}
        </div>

        {/* Mobile controls — hidden on desktop, shown on mobile via CSS */}
        <div className="project-carousel__mobile-arrows hidden">
          <button
            type="button"
            onClick={previous}
            aria-label={t("common.previous")}
            className="project-carousel__mobile-prev rounded-full p-2 shadow-md transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t("common.next")}
            className="project-carousel__mobile-next rounded-full p-2 shadow-md transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile dots — hidden on desktop, shown on mobile via CSS */}
        <div className="project-carousel__mobile-dots hidden">
          {dots}
        </div>
      </div>
      {modal}
    </>
  );
}

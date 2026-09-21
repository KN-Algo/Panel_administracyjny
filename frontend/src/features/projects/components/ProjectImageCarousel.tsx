import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog } from "@/shared";

type SlideDirection = "left" | "right";
type CarouselDirection = "next" | "prev";

interface ProjectImageCarouselProps {
  images: string[];
  title: string;
}

const getImageSource = (image: string) => image.replace("../img/", "/img/");

export default function ProjectImageCarousel({
  images,
  title,
}: ProjectImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlide, setModalSlide] = useState(0);
  const [slideDirection, setSlideDirection] =
    useState<SlideDirection>("right");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeSlide = (direction: CarouselDirection) => {
    setCurrentSlide((previousSlide) =>
      direction === "next"
        ? (previousSlide + 1) % images.length
        : previousSlide === 0
          ? images.length - 1
          : previousSlide - 1,
    );
  };

  const openModal = (startIndex = 0) => {
    setModalSlide(startIndex);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalSlide(0);
    setIsTransitioning(false);
  }, []);

  const changeModalSlide = useCallback(
    (direction: CarouselDirection) => {
      if (isTransitioning) return;

      setSlideDirection(direction === "next" ? "right" : "left");
      setIsTransitioning(true);
      window.setTimeout(() => {
        setModalSlide((previousSlide) =>
          direction === "next"
            ? (previousSlide + 1) % images.length
            : previousSlide === 0
              ? images.length - 1
              : previousSlide - 1,
        );
        setIsTransitioning(false);
      }, 300);
    },
    [images.length, isTransitioning],
  );

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "ArrowLeft") changeModalSlide("prev");
      if (keyboardEvent.key === "ArrowRight") changeModalSlide("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeModalSlide, isModalOpen]);

  const modal = (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      title={title}
      closeOnBackdrop={false}
      overlayClassName="bg-black/95"
      className="inset-0 flex items-center justify-center"
    >
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close gallery"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                key={modalSlide}
                src={getImageSource(images[modalSlide])}
                alt={`Modal image ${modalSlide + 1}`}
                className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-500 ease-out ${
                  isTransitioning
                    ? slideDirection === "right"
                      ? "opacity-0 translate-x-20"
                      : "opacity-0 -translate-x-20"
                    : "opacity-100 translate-x-0"
                }`}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => changeModalSlide("prev")}
                  disabled={isTransitioning}
                  aria-label="Previous image"
                  className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  onClick={() => changeModalSlide("next")}
                  disabled={isTransitioning}
                  aria-label="Next image"
                  className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full p-4 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                  {modalSlide + 1} / {images.length}
                </div>
              </>
            )}
          </div>
    </Dialog>
  );

  if (images.length === 1) {
    return (
      <>
        <button
          type="button"
          className="relative flex w-full justify-center"
          onClick={() => openModal()}
          aria-label={`Open ${title} image`}
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
            onClick={() => openModal(currentSlide)}
            aria-label={`Open ${title} image ${currentSlide + 1}`}
          >
            <img
              src={getImageSource(images[currentSlide])}
              alt={`${title} - ${currentSlide + 1}`}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
            />
          </button>
        </div>

        <button
          type="button"
          onClick={() => changeSlide("prev")}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark rounded-full p-3 shadow-lg transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => changeSlide("next")}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark rounded-full p-3 shadow-lg transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
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

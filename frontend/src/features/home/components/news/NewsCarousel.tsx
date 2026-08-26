import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsItem } from "@/types";
import NewsCard from "./NewsCard";
import { useResponsiveCarousel } from "../../hooks/useResponsiveCarousel";

const GRID_PATTERN_SVG =
  "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff0d' stroke-width='0.5'%3E%3Cpath d='M0 0 L100 0 L100 100 L0 100 Z'/%3E%3Cpath d='M0 20 L100 20 M0 40 L100 40 M0 60 L100 60 M0 80 L100 80'/%3E%3Cpath d='M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100'/%3E%3C/g%3E%3C/svg%3E";

export interface NewsCarouselProps {
  title: string;
  news: NewsItem[];
  readMoreLabel: string;
  previousSlideLabel: string;
  nextSlideLabel: string;
  getSlideLabel: (slideNumber: number) => string;
}

export default function NewsCarousel({
  title,
  news,
  readMoreLabel,
  previousSlideLabel,
  nextSlideLabel,
  getSlideLabel,
}: NewsCarouselProps) {
  const {
    currentSlide,
    itemsPerSlide,
    totalSlides,
    isTransitioning,
    nextSlide,
    previousSlide,
    goToSlide,
  } = useResponsiveCarousel(news.length);

  const displayedNews = news.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide,
  );
  const centerIncompleteDesktopSlide =
    itemsPerSlide === 3 && displayedNews.length === 2;

  return (
    <section
      className="relative py-20 text-white z-10"
      style={{
        backgroundColor: "var(--color-brand-darkest)",
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0),
          url("${GRID_PATTERN_SVG}")
        `,
        backgroundSize: "100px 100px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {title}
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={previousSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={previousSlideLabel}
          >
            <ChevronLeft size={32} />
          </button>

          <div className="min-h-[620px] flex items-center justify-center">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full max-w-7xl transition-all duration-300 ease-in-out ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
              style={{
                gridTemplateColumns: centerIncompleteDesktopSlide
                  ? "repeat(2, minmax(0, 400px))"
                  : undefined,
                justifyContent: centerIncompleteDesktopSlide
                  ? "center"
                  : undefined,
              }}
            >
              {displayedNews.map((item, index) => (
                <NewsCard
                  key={currentSlide * itemsPerSlide + index}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  eventId={item.link?.split("#")[1]}
                  readMoreLabel={readMoreLabel}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={nextSlideLabel}
          >
            <ChevronRight size={32} />
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-brand-light w-8"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={getSlideLabel(index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

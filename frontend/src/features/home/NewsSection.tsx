import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import newsDataPl from '@/data/news_pl.json';
import newsDataEn from '@/data/news_en.json';
import newsDataDe from '@/data/news_de.json';
import type { NewsItem } from '@/types';

export default function NewsSection() {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const newsData = useMemo(() => {
    const lang = i18n.language;
    if (lang === 'en') return newsDataEn;
    if (lang === 'de') return newsDataDe;
    return newsDataPl;
  }, [i18n.language]);
  
  const allNews = [...newsData].reverse() as NewsItem[];
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(allNews.length / itemsPerSlide);

  const handleSlideChange = (newSlide: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSlide(newSlide);
      setIsTransitioning(false);
    }, 300);
  };

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    handleSlideChange(index);
  };

  const displayedNews = allNews.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  return (
    <section 
      className="relative py-20 text-white z-10"
      style={{
        backgroundColor: '#0b0c2a',
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff0d' stroke-width='0.5'%3E%3Cpath d='M0 0 L100 0 L100 100 L0 100 Z'/%3E%3Cpath d='M0 20 L100 20 M0 40 L100 40 M0 60 L100 60 M0 80 L100 80'/%3E%3Cpath d='M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100'/%3E%3C/g%3E%3C/svg%3E")
        `,
        backgroundSize: '100px 100px',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('home.news_title')}
        </h2>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Cards */}
          <div 
            className={`flex flex-wrap justify-center gap-8 px-4 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {displayedNews.map((news, index) => (
              <div key={currentSlide * itemsPerSlide + index} className="flex-[0_1_360px]">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-145">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-64 object-contain bg-[#fcfbfb] shrink-0"
                  />
                  <div className="p-6 bg-[#f3f0f0] grow flex flex-col justify-between">
                    <div className="grow">
                      <h3 className="font-semibold text-xl mb-2 text-black line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-700 text-base mb-4 line-clamp-4">
                        {news.description}
                      </p>
                    </div>
                    <Link
                      to="/events"
                      state={{ eventId: news.link?.split('#')[1] }}
                      className="inline-block bg-[#000424] text-white px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[#000424]/90 text-center mt-auto"
                    >
                      {t('home.read_more')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-[#f8e9e5] w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

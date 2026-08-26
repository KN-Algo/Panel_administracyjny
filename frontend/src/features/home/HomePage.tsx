import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import newsDataDe from "@/data/news_de.json";
import newsDataEn from "@/data/news_en.json";
import newsDataPl from "@/data/news_pl.json";
import type { NewsItem } from "@/types";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import NewsCarousel from "./components/NewsCarousel";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const news = useMemo(() => {
    const language = i18n.language;
    const localizedNews =
      language === "en"
        ? newsDataEn
        : language === "de"
          ? newsDataDe
          : newsDataPl;

    return [...localizedNews].reverse() as NewsItem[];
  }, [i18n.language]);

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <NewsCarousel
        title={t("home.news_title")}
        news={news}
        readMoreLabel={t("home.read_more")}
        previousSlideLabel="Previous"
        nextSlideLabel="Next"
        getSlideLabel={(slideNumber) => `Go to slide ${slideNumber}`}
      />
    </div>
  );
}

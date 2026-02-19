import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import NewsSection from './NewsSection';

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <NewsSection />
    </div>
  );
}

import { useTranslation } from "react-i18next";
import HeroAnimation from "./components/hero/HeroAnimation";
import HeroContent from "./components/hero/HeroContent";
import HeroSectionLayout from "./components/hero/HeroSectionLayout";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <HeroSectionLayout>
      <HeroAnimation />
      <HeroContent title={t("home.title")} motto={t("home.motto")} />
    </HeroSectionLayout>
  );
}

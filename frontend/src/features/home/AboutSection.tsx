import { useTranslation } from "react-i18next";
import { Code, Lightbulb, FlaskConical } from "lucide-react";
import type { AboutCardProps } from "./components/about/AboutCard";
import AboutCards from "./components/about/AboutCards";
import AboutFooter from "./components/about/AboutFooter";
import AboutHeader from "./components/about/AboutHeader";
import AboutSectionLayout from "./components/about/AboutSectionLayout";

export default function AboutSection() {
  const { t } = useTranslation();

  const cards: AboutCardProps[] = [
    {
      icon: Code,
      title: t("home.about_tile1_title"),
      description: t("home.about_tile1_desc"),
      tone: "purple",
      delay: 0,
    },
    {
      icon: Lightbulb,
      title: t("home.about_tile2_title"),
      description: t("home.about_tile2_desc"),
      tone: "blue",
      delay: 150,
    },
    {
      icon: FlaskConical,
      title: t("home.about_tile3_title"),
      description: t("home.about_tile3_desc"),
      tone: "indigo",
      delay: 300,
    },
  ];

  return (
    <AboutSectionLayout>
      <AboutHeader
        title={t("home.about_title")}
        subtitle={t("home.about_subtitle")}
      />
      <AboutCards cards={cards} />
      <AboutFooter text={t("home.about_footer_text")} />
    </AboutSectionLayout>
  );
}

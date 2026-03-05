import { useTranslation } from "react-i18next";
import { Code } from "lucide-react";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full py-16 bg-white z-10">
      <section className="max-w-212.5 mx-auto text-center px-5 py-16 rounded-xl bg-white text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2 mb-3 text-gray-900">
          <Code className="w-8 h-8 text-gray-900" />
          <span>{t("home.about_title")}</span>
        </h2>

        <div className="w-16 h-1 bg-[#eeded9] my-4 mx-auto rounded-full transition-transform duration-400"></div>

        <p className="text-lg mb-4 leading-relaxed text-gray-800">
          {t("home.about_who_we_are")}
        </p>
        <p className="text-lg mb-4 leading-relaxed text-gray-800">
          {t("home.about_our_goal")}
        </p>
        <p className="text-lg leading-relaxed text-gray-800">
          {t("home.about_our_impact")}
        </p>
      </section>
    </div>
  );
}

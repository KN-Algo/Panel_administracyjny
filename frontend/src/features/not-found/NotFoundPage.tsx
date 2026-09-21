import { useTranslation } from "react-i18next";

import BackToHomeButton from "./BackToHomeButton";
import NotFoundAnimation from "./components/NotFoundAnimation";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[32rem] flex-1 items-center justify-center overflow-hidden bg-brand-dark px-4 py-16 text-brand-light">
      <NotFoundAnimation />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-brand-light/70">
          {t("not_found.error_label")}
        </p>
        <h1 className="text-8xl font-bold leading-none tracking-tight text-brand-light sm:text-9xl md:text-[11rem]">
          404
        </h1>
        <div className="my-7 h-px w-24 bg-brand-light/40" />
        <h2 className="text-2xl font-semibold text-brand-light sm:text-3xl">
          {t("not_found.title")}
        </h2>
        <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-relaxed text-brand-light/75 sm:text-lg">
          {t("not_found.description")}
        </p>
        <BackToHomeButton />
      </div>
    </section>
  );
}

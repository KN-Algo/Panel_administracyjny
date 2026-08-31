import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function BackToHomeButton() {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-light px-5 py-3 text-sm font-semibold text-brand-dark transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      {t("not_found.back_home")}
    </Link>
  );
}

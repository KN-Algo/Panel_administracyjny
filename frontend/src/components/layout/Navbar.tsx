import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/team", label: t("nav.team") },
    { path: "/projects", label: t("nav.projects") },
    { path: "/events", label: t("nav.events") },
  ];

  return (
    <nav className="bg-[#000424] text-white sticky top-0 z-50 shadow-lg h-[120px] flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/img/favicos/favicon.svg"
              alt="Logo"
              className="w-28 h-28"
            />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="relative text-[#f8e9e5] transition-colors hover:text-white group"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-0.75 w-0 h-0.5 bg-[#f8e9e5] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Switcher */}
          <div className="flex gap-3">
            {["pl", "en", "de"].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                  i18n.language === lang
                    ? "bg-[#f8e9e5] text-[#000424] shadow-lg shadow-[#f8e9e5]/30 scale-105"
                    : "bg-transparent text-[#f8e9e5] border-2 border-[#f8e9e5]/40 hover:border-[#f8e9e5] hover:shadow-md hover:shadow-[#f8e9e5]/20 hover:scale-105"
                }`}
                aria-label={
                  lang === "pl"
                    ? "Polski"
                    : lang === "en"
                      ? "English"
                      : "Deutsch"
                }
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

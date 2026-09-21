import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MobileNavigation from "./MobileNavigation";
import { Button, ContentContainer } from "@/shared";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const logoRef = useRef<HTMLAnchorElement>(null);

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
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-lg h-[120px] flex items-center">
      <ContentContainer>
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link ref={logoRef} to="/" className="flex shrink-0 items-center">
            <img
              src="/img/favicos/favicon.svg"
              alt="Logo"
              className="h-14 w-14 md:h-20 md:w-20"
            />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="relative text-brand-light transition-colors hover:text-white group"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-[3px] w-0 h-0.5 bg-brand-light transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 md:gap-3">
            {["pl", "en", "de"].map((lang) => (
              <Button
                key={lang}
                className="min-h-11 px-2 md:px-4"
                onClick={() => changeLanguage(lang)}
                appearance={
                  i18n.language === lang ? "light" : "outlineOnDark"
                }
                motion={
                  i18n.language === lang
                    ? "languageActive"
                    : "languageIdle"
                }
                aria-label={
                  lang === "pl"
                    ? "Polski"
                    : lang === "en"
                      ? "English"
                      : "Deutsch"
                }
              >
                {lang}
              </Button>
            ))}
            <MobileNavigation links={navLinks} desktopFocusRef={logoRef} />
          </div>
        </div>
      </ContentContainer>
    </nav>
  );
}

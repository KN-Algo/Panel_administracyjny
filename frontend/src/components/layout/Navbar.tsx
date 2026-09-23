import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MobileNavigation from "./MobileNavigation";
import { useElementHeight } from "./useElementHeight";
import { PublicNavigationLink } from "./PublicNavigationLink";
import { Button, ContentContainer } from "@/shared";

interface NavbarProps {
  onHeightChange: (height: number) => void;
}

export default function Navbar({ onHeightChange }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navbarRef = useElementHeight<HTMLElement>(onHeightChange);

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
    <nav ref={navbarRef} className="sticky top-0 z-50 bg-brand-dark text-white shadow-lg">
      <ContentContainer className="px-3 sm:px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link ref={logoRef} to="/" className="flex shrink-0 items-center">
            <img
              src="/img/favicos/favicon.svg"
              alt="Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-20 md:w-20"
            />
          </Link>

          {/* Navigation Links */}
          <ul className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => (
              <li key={link.path}>
                <PublicNavigationLink
                  to={link.path}
                  variant="desktop"
                >
                  {link.label}
                </PublicNavigationLink>
              </li>
            ))}
          </ul>

          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {["pl", "en", "de"].map((lang) => (
              <Button
                key={lang}
                className="min-h-11 min-w-11 px-1.5 sm:px-2 md:px-4"
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

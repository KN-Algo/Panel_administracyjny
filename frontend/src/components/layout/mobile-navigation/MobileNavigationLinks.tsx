import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface NavigationLink {
  path: string;
  label: string;
}

interface MobileNavigationLinksProps {
  links: NavigationLink[];
  pathname: string;
  onNavigate: () => void;
}

export function MobileNavigationLinks({ links, pathname, onNavigate }: MobileNavigationLinksProps) {
  const { t } = useTranslation();

  return (
    <ul aria-label={t("nav.menu")} className="mobile-navigation__links border-t border-brand-light-40 py-3">
      {links.map((link, index) => (
        <li
          key={link.path}
          className="mobile-navigation__item"
          style={{ "--link-index": index } as CSSProperties}
        >
          <Link
            to={link.path}
            aria-current={pathname === link.path ? "page" : undefined}
            onClick={onNavigate}
            className="flex min-h-12 items-center rounded-md px-3 py-3 text-lg text-brand-light hover:bg-brand-dark-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-light"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

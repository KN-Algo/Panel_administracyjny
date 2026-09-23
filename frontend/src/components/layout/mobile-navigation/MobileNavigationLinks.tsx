import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { PublicNavigationLink } from "../PublicNavigationLink";
import { useMobileLinkNavigation } from "./useMobileLinkNavigation";

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
  const { pendingPath, navigateAfterAnimation } = useMobileLinkNavigation(pathname, onNavigate);

  return (
    <ul aria-label={t("nav.menu")} className="mobile-navigation__links border-t border-brand-light-40 py-3">
      {links.map((link, index) => (
        <li
          key={link.path}
          className="mobile-navigation__item"
          style={{ "--link-index": index } as CSSProperties}
        >
          <PublicNavigationLink
            to={link.path}
            variant="mobile"
            disabled={pendingPath !== null}
            navigating={pendingPath === link.path}
            onClick={(event) => navigateAfterAnimation(link.path, pathname === link.path, event)}
          >
            {link.label}
          </PublicNavigationLink>
        </li>
      ))}
    </ul>
  );
}

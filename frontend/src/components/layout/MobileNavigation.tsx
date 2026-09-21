import { useEffect, useRef, useState, type RefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Popover } from "radix-ui";
import { Button } from "@/shared";

interface MobileNavigationProps {
  links: { path: string; label: string }[];
  desktopFocusRef: RefObject<HTMLAnchorElement | null>;
}

export default function MobileNavigation({ links, desktopFocusRef }: MobileNavigationProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [openLocation, setOpenLocation] = useState<typeof location | null>(null);
  const menuOpen = openLocation === location;
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpenLocation(null);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <Popover.Root
      open={menuOpen}
      onOpenChange={(open) => setOpenLocation(open ? location : null)}
    >
      <Popover.Trigger asChild>
        <Button
          appearance="outlineOnDark"
          className="h-11 w-11 shrink-0 p-0 md:hidden"
          aria-label={t(menuOpen ? "nav.closeMenu" : "nav.openMenu")}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          collisionPadding={16}
          aria-label={t("nav.menu")}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            firstMobileLinkRef.current?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const links = event.currentTarget.querySelectorAll("a");
            const boundary = event.shiftKey ? links[0] : links[links.length - 1];
            if (document.activeElement === boundary) {
              event.preventDefault();
              setOpenLocation(null);
            }
          }}
          className="z-50 w-[calc(100vw-2rem)] max-w-sm max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-lg border border-brand-light-40 bg-brand-dark p-2 text-white shadow-lg md:hidden"
          onCloseAutoFocus={(event) => {
            // The mobile trigger is hidden after crossing the desktop breakpoint.
            if (window.matchMedia("(min-width: 768px)").matches) {
              event.preventDefault();
              desktopFocusRef.current?.focus();
            }
          }}
        >
          <ul>
            {links.map((link, index) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  aria-current={location.pathname === link.path ? "page" : undefined}
                  onClick={() => setOpenLocation(null)}
                  className="flex min-h-11 items-center rounded-md px-4 py-3 text-brand-light hover:bg-brand-dark-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

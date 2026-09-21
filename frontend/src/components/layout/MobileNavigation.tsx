import { useId, type RefObject } from "react";
import { MobileNavigationTrigger } from "./mobile-navigation/MobileNavigationTrigger";
import { MobileNavigationPanel } from "./mobile-navigation/MobileNavigationPanel";
import { MobileNavigationLinks, type NavigationLink } from "./mobile-navigation/MobileNavigationLinks";
import { useMobileNavigation } from "./useMobileNavigation";
import "./mobile-navigation.css";

interface MobileNavigationProps {
  links: NavigationLink[];
  desktopFocusRef: RefObject<HTMLAnchorElement | null>;
}

export default function MobileNavigation({ links, desktopFocusRef }: MobileNavigationProps) {
  const id = useId();
  const { open, close, toggle, location, triggerRef, panelRef } = useMobileNavigation(desktopFocusRef);

  return (
    <>
      <MobileNavigationTrigger
        open={open}
        panelId={id}
        triggerRef={triggerRef}
        onToggle={toggle}
      />
      <MobileNavigationPanel id={id} open={open} panelRef={panelRef} onClose={close}>
        <MobileNavigationLinks links={links} pathname={location.pathname} onNavigate={close} />
      </MobileNavigationPanel>
    </>
  );
}

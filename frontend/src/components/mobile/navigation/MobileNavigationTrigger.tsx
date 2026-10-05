import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared";
import { useNavigationTriggerPulse } from "./useNavigationTriggerPulse";

interface MobileNavigationTriggerProps {
  open: boolean;
  panelId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
}

export function MobileNavigationTrigger({ open, panelId, triggerRef, onToggle }: MobileNavigationTriggerProps) {
  const { t } = useTranslation();
  const { pulsing, pulse, clearPulse } = useNavigationTriggerPulse();

  return (
    <Button
      asChild
      appearance="outlineOnDark"
      className={`mobile-navigation__trigger h-11 w-11 shrink-0 p-0 md:hidden${pulsing ? " mobile-navigation__trigger--pulse" : ""}`}
      aria-label={t(open ? "nav.closeMenu" : "nav.openMenu")}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => {
        pulse();
        onToggle();
      }}
      onAnimationEnd={clearPulse}
    >
      <button ref={triggerRef} type="button">
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </Button>
  );
}

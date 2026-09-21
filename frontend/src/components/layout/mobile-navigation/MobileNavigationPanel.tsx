import type { KeyboardEvent, ReactNode, RefObject } from "react";
import { ContentContainer } from "@/shared";

interface MobileNavigationPanelProps {
  id: string;
  open: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  children: ReactNode;
}

export function MobileNavigationPanel({ id, open, panelRef, onClose, children }: MobileNavigationPanelProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const items = event.currentTarget.querySelectorAll("a");
    const boundary = event.shiftKey ? items[0] : items[items.length - 1];
    if (document.activeElement === boundary) {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div
      ref={panelRef}
      id={id}
      data-open={open}
      inert={!open}
      aria-hidden={!open}
      className="mobile-navigation bg-brand-dark text-white md:hidden"
      onKeyDown={handleKeyDown}
    >
      <div className="mobile-navigation__clip">
        <ContentContainer>{children}</ContentContainer>
      </div>
    </div>
  );
}

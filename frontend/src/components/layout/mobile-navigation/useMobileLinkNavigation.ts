import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

const navigationDelay = 400;

export function useMobileLinkNavigation(pathname: string, onClose: () => void) {
  const navigate = useNavigate();
  const [pendingNavigation, setPendingNavigation] = useState<{ path: string; pathname: string } | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const pendingPath = pendingNavigation?.pathname === pathname
    ? pendingNavigation.path
    : null;

  const navigateAfterAnimation = (path: string, isCurrent: boolean, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;

    event.preventDefault();
    if (pendingPath) return;

    if (isCurrent) {
      onClose();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate(path);
      onClose();
      return;
    }

    setPendingNavigation({ path, pathname });
    timeoutRef.current = window.setTimeout(() => {
      navigate(path);
      onClose();
    }, navigationDelay);
  };

  return { pendingPath, navigateAfterAnimation };
}

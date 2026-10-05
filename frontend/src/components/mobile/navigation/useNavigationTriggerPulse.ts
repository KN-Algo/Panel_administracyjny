import { useEffect, useRef, useState } from "react";

export function useNavigationTriggerPulse() {
  const [pulsing, setPulsing] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const pulse = () => {
    setPulsing(false);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(() => setPulsing(true));
    });
  };

  return { pulsing, pulse, clearPulse: () => setPulsing(false) };
}

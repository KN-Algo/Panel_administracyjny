import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

import { useParticlesEngine } from "@/hooks/useParticlesEngine";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PUBLIC_THEME_FALLBACKS } from "@/shared/styles/theme";

const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return PUBLIC_THEME_FALLBACKS.brandLight;

  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || PUBLIC_THEME_FALLBACKS.brandLight
  );
};

export default function NotFoundAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const isEngineReady = useParticlesEngine(!prefersReducedMotion);
  const options = useMemo<ISourceOptions>(
    () => ({
      fpsLimit: 60,
      fullScreen: false,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      interactivity: {
        events: {
          onClick: { enable: false },
          onHover: { enable: false },
        },
      },
      particles: {
        color: {
          value: getThemeColor("--color-brand-light"),
        },
        links: {
          color: getThemeColor("--color-brand-light"),
          distance: 120,
          enable: true,
          opacity: 0.4,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          value: 100,
        },
        opacity: {
          value: { min: 0.3, max: 0.6 },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (prefersReducedMotion || !isEngineReady) return null;

  return (
    <Particles
      id="tsparticles-404"
      options={options}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}

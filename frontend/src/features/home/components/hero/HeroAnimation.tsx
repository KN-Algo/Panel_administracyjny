import { useMemo } from "react";
import Particles from "@tsparticles/react";
import { PUBLIC_THEME_FALLBACKS } from "@/shared/styles/theme";
import { useParticlesEngine } from "../../hooks/useParticlesEngine";

const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return PUBLIC_THEME_FALLBACKS.brandLight;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || PUBLIC_THEME_FALLBACKS.brandLight
  );
};

export default function HeroAnimation() {
  const isEngineReady = useParticlesEngine();
  const options = useMemo(
    () => ({
      fpsLimit: 120,
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
          direction: "none" as const,
          enable: true,
          outModes: {
            default: "out" as const,
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
          type: "circle" as const,
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!isEngineReady) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 z-0"
    />
  );
}

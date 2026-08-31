import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { PUBLIC_THEME_FALLBACKS } from "@/shared/styles/theme";
import { useParticlesEngine } from "../../hooks/useParticlesEngine";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const MOBILE_PARTICLE_COUNT = 48;
const TABLET_PARTICLE_COUNT = 84;
const DESKTOP_PARTICLE_COUNT = 120;
const MOBILE_PARTICLE_LIMIT = 240;
const TABLET_PARTICLE_LIMIT = 360;
const DESKTOP_PARTICLE_LIMIT = 1440;
const PARTICLES_ADDED_PER_CLICK = 4;

const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return PUBLIC_THEME_FALLBACKS.brandLight;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || PUBLIC_THEME_FALLBACKS.brandLight
  );
};

export default function HeroAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const isEngineReady = useParticlesEngine(!prefersReducedMotion);
  const options = useMemo<ISourceOptions>(
    () => ({
      fpsLimit: 60,
      fullScreen: false,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      interactivity: {
        detectsOn: "window",
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.5,
            },
          },
          push: {
            quantity: PARTICLES_ADDED_PER_CLICK,
          },
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
          density: {
            enable: false,
          },
          limit: {
            mode: "delete",
            value: DESKTOP_PARTICLE_LIMIT,
          },
          value: DESKTOP_PARTICLE_COUNT,
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
      responsive: [
        {
          maxWidth: 768,
          options: {
            particles: {
              number: {
                limit: {
                  value: MOBILE_PARTICLE_LIMIT,
                },
                value: MOBILE_PARTICLE_COUNT,
              },
            },
          },
        },
        {
          maxWidth: 1024,
          options: {
            particles: {
              number: {
                limit: {
                  value: TABLET_PARTICLE_LIMIT,
                },
                value: TABLET_PARTICLE_COUNT,
              },
            },
          },
        },
      ],
    }),
    [],
  );

  if (prefersReducedMotion || !isEngineReady) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}

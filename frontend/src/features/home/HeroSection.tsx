import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import { useTranslation } from "react-i18next";

// Helper function to get CSS variable value
const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return "#f8e9e5"; // fallback for SSR
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || "#f8e9e5"
  );
};

export default function HeroSection() {
  const { t } = useTranslation();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (): Promise<void> => {
    // Particles loaded successfully
  };

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

  return (
    <section className="relative w-full h-[calc(100vh-120px)] bg-brand-dark text-brand-light flex items-center justify-center overflow-hidden z-0">
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          className="absolute inset-0 z-0"
        />
      )}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-brand-light">
          {t("home.title")}
        </h1>
        <p className="text-xl md:text-2xl text-brand-light">
          {t("home.motto")}
        </p>
      </div>
    </section>
  );
}

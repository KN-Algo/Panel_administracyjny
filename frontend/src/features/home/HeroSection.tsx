import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import { useTranslation } from "react-i18next";
import { ContentContainer, Heading, Text } from "@/shared";
import { PUBLIC_THEME_FALLBACKS } from "@/shared/styles/theme";

// Helper function to get CSS variable value
const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return PUBLIC_THEME_FALLBACKS.brandLight;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || PUBLIC_THEME_FALLBACKS.brandLight
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
      <ContentContainer align="center" className="relative z-10">
        <Heading
          level={1}
          size="display"
          tone="brandLight"
          align="center"
          spacingBottom="md"
        >
          {t("home.title")}
        </Heading>
        <Text size="hero" tone="brandLight" align="center">
          {t("home.motto")}
        </Text>
      </ContentContainer>
    </section>
  );
}

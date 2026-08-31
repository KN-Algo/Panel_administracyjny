import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import { useTranslation } from "react-i18next";
import BackToHomeButton from "./BackToHomeButton";

const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return "#f8e9e5";

  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || "#f8e9e5"
  );
};

export default function NotFoundPage() {
  const { t } = useTranslation();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

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
    <section className="relative flex min-h-[32rem] flex-1 items-center justify-center overflow-hidden bg-brand-dark px-4 py-16 text-brand-light">
      {init && (
        <Particles
          id="tsparticles-404"
          options={options}
          className="absolute inset-0 z-0"
        />
      )}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-brand-light/70">
          {t("not_found.error_label")}
        </p>
        <h1 className="text-8xl font-bold leading-none tracking-tight text-brand-light sm:text-9xl md:text-[11rem]">
          404
        </h1>
        <div className="my-7 h-px w-24 bg-brand-light/40" />
        <h2 className="text-2xl font-semibold text-brand-light sm:text-3xl">
          {t("not_found.title")}
        </h2>
        <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-relaxed text-brand-light/75 sm:text-lg">
          {t("not_found.description")}
        </p>
        <BackToHomeButton />
      </div>
    </section>
  );
}

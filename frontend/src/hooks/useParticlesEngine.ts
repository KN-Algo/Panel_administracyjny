import { useEffect, useState } from "react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

let engineInitialization: Promise<void> | null = null;

const initializeEngine = (): Promise<void> => {
  engineInitialization ??= initParticlesEngine(async (engine: Engine) => {
    await loadSlim(engine);
  });

  return engineInitialization;
};

export function useParticlesEngine(enabled = true): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let isActive = true;

    initializeEngine().then(() => {
      if (isActive) setIsReady(true);
    });

    return () => {
      isActive = false;
    };
  }, [enabled]);

  return enabled && isReady;
}

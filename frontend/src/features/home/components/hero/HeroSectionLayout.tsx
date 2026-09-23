import type { ReactNode } from "react";

export interface HeroSectionLayoutProps {
  children: ReactNode;
}

export default function HeroSectionLayout({
  children,
}: HeroSectionLayoutProps) {
  return (
    <section className="relative z-0 -mx-12 -mt-12 -mb-12 flex min-h-[calc(100svh-var(--public-navbar-height)+6rem)] w-[calc(100%+6rem)] items-center justify-center overflow-hidden bg-brand-dark px-12 py-12 text-brand-light">
      {children}
    </section>
  );
}

import type { ReactNode } from "react";

export interface HeroSectionLayoutProps {
  children: ReactNode;
}

export default function HeroSectionLayout({
  children,
}: HeroSectionLayoutProps) {
  return (
    <section className="relative -mx-12 -mt-12 -mb-12 h-[calc(100vh-24px)] w-[calc(100%+6rem)] px-12 py-12 bg-brand-dark text-brand-light flex items-center justify-center overflow-hidden z-0">
      {children}
    </section>
  );
}

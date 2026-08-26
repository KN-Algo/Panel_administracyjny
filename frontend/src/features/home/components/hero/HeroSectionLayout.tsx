import type { ReactNode } from "react";

export interface HeroSectionLayoutProps {
  children: ReactNode;
}

export default function HeroSectionLayout({
  children,
}: HeroSectionLayoutProps) {
  return (
    <section className="relative w-full h-[calc(100vh-120px)] bg-brand-dark text-brand-light flex items-center justify-center overflow-hidden z-0">
      {children}
    </section>
  );
}

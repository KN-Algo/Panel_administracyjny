import type { ReactNode } from "react";

export interface AboutSectionLayoutProps {
  children: ReactNode;
}

export default function AboutSectionLayout({
  children,
}: AboutSectionLayoutProps) {
  return (
    <section className="home-about relative w-full py-20 bg-gradient-to-b from-gray-50 to-white z-10">
      <div className="home-about__container max-w-7xl mx-auto px-5">{children}</div>
    </section>
  );
}

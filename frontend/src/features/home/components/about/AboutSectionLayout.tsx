import type { ReactNode } from "react";

export interface AboutSectionLayoutProps {
  children: ReactNode;
}

export default function AboutSectionLayout({
  children,
}: AboutSectionLayoutProps) {
  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-gray-50 to-white z-10">
      <div className="max-w-7xl mx-auto px-5">{children}</div>
    </section>
  );
}

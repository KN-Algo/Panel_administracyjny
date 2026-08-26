import type { ReactNode } from "react";
import { Surface } from "@/shared";

export type AboutCardTone = "purple" | "blue" | "indigo";

const gradientByTone: Record<AboutCardTone, string> = {
  purple: "bg-gradient-to-br from-purple-500 to-purple-700",
  blue: "bg-gradient-to-br from-blue-500 to-blue-700",
  indigo: "bg-gradient-to-br from-indigo-500 to-indigo-700",
};

export interface AboutCardAnimationProps {
  children: ReactNode;
  tone: AboutCardTone;
  delay: number;
}

export default function AboutCardAnimation({
  children,
  tone,
  delay,
}: AboutCardAnimationProps) {
  return (
    <Surface
      tone="white"
      radius="2xl"
      padding="xl"
      shadow="md"
      interaction="liftStrong"
      overflow="hidden"
      position="relative"
      group
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`absolute inset-0 ${gradientByTone[tone]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className="relative z-10">{children}</div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </Surface>
  );
}

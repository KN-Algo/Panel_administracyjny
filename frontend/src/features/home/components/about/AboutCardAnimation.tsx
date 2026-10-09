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
  expanded: boolean;
  onToggle?: () => void;
}

export default function AboutCardAnimation({
  children,
  tone,
  delay,
  expanded,
  onToggle,
}: AboutCardAnimationProps) {
  return (
    <Surface
      as={onToggle ? "button" : undefined}
      tone="white"
      radius="2xl"
      padding="xl"
      shadow="md"
      interaction={onToggle ? "scale" : "liftStrong"}
      overflow="hidden"
      position="relative"
      group
      className={`home-about__card${expanded ? " is-expanded" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      cursor={onToggle ? "pointer" : "default"}
      width="full"
      aria-expanded={onToggle ? expanded : undefined}
      onClick={onToggle}
    >
      <div
        className={`absolute inset-0 ${gradientByTone[tone]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className="relative z-10">{children}</div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </Surface>
  );
}

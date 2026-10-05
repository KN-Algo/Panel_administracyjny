import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heading, Text } from "@/shared";

export interface AboutHeaderProps {
  title: string;
  subtitle: string;
}

export default function AboutHeader({ title, subtitle }: AboutHeaderProps) {
  const isMobile = useIsMobile();
  const [isActive, setIsActive] = useState(false);
  const canToggle = isMobile;

  return (
    <div
      className={`home-about__header text-center mb-16 group ${
        canToggle ? "cursor-pointer" : "cursor-default"
      }${isActive && canToggle ? " is-mobile-active" : ""}`}
      role={canToggle ? "button" : undefined}
      tabIndex={canToggle ? 0 : undefined}
      aria-pressed={canToggle ? isActive : undefined}
      onClick={canToggle ? () => setIsActive((active) => !active) : undefined}
      onKeyDown={(event) => {
        if (!canToggle || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        setIsActive((active) => !active);
      }}
    >
      <Heading
        level={2}
        size="feature"
        align="center"
        spacingBottom="lg"
        tracking="tight"
        className="home-about__title transition-all duration-300 group-hover:scale-[1.02]"
      >
        {title}
      </Heading>
      <div className="home-about__divider w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 mx-auto rounded-full mb-6 shadow-sm transition-all duration-500 group-hover:w-48 group-hover:shadow-md" />
      <Text
        size="xl"
        tone="muted"
        weight="light"
        align="center"
        leading="relaxed"
        className="home-about__subtitle max-w-3xl mx-auto"
      >
        {subtitle}
      </Text>
    </div>
  );
}

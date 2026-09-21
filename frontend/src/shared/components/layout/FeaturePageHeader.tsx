import { useEffect, useState, type ReactNode } from "react";

import { ContentContainer } from "./ContentContainer";
import { Section } from "./Section";
import { IconFrame } from "../display/IconFrame";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

interface FeaturePageHeaderProps {
  title: ReactNode;
  subtitle: ReactNode;
  icon: ReactNode;
}

export function FeaturePageHeader({
  title,
  subtitle,
  icon,
}: FeaturePageHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <Section
      as="header"
      tone="brand"
      spacing="none"
      align="center"
      className="relative isolate overflow-hidden bg-gradient-to-br from-brand-dark via-brand-medium to-brand-deeper"
    >
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-32 h-72 w-72 rounded-full border border-brand-light-20 animate-pulse [animation-duration:7s] motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="absolute -left-8 -top-16 h-44 w-44 rounded-full border border-brand-light-10 animate-pulse [animation-duration:5s] motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-brand-light-10 blur-3xl animate-pulse [animation-duration:8s] motion-reduce:animate-none"
      />

      <ContentContainer className="relative py-9 md:py-11">
        <div className="group/header flex flex-col items-center">
          <div
            className={`mb-3 transition-[opacity,transform] duration-1000 ease-out motion-reduce:opacity-100 motion-reduce:scale-100 motion-reduce:transition-none ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <IconFrame
              size="md"
              radius="xl"
              tone="glass"
              className="transition-transform duration-300 ease-out group-hover/header:-rotate-6 group-hover/header:scale-125 motion-reduce:transition-none"
            >
              {icon}
            </IconFrame>
          </div>
          <Heading
            level={1}
            size="page"
            tone="brandLight"
            align="center"
            tracking="tight"
            className={`transition-[opacity,transform] duration-1000 delay-100 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {title}
          </Heading>
          <div
            aria-hidden="true"
            className={`my-3 transition-[opacity,transform] duration-1000 delay-200 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <div className="h-1 w-14 rounded-full bg-brand-light-40 transition-[width,background-color] duration-300 ease-out group-hover/header:w-32 group-hover/header:bg-brand-light motion-reduce:transition-none" />
          </div>
          <Text
            size="base"
            tone="brandLight"
            align="center"
            leading="relaxed"
            className={`max-w-xl text-brand-light/80 transition-[opacity,transform] duration-1000 delay-300 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {subtitle}
          </Text>
        </div>
      </ContentContainer>
    </Section>
  );
}

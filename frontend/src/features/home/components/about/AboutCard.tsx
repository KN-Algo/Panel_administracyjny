import { useState } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heading, IconFrame, Text } from "@/shared";
import AboutCardAnimation, {
  type AboutCardTone,
} from "./AboutCardAnimation";

const iconClassByTone: Record<AboutCardTone, string> = {
  purple:
    "w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300",
  blue: "w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300",
  indigo:
    "w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300",
};

export interface AboutCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: AboutCardTone;
  delay: number;
}

export default function AboutCard({
  icon: Icon,
  title,
  description,
  tone,
  delay,
}: AboutCardProps) {
  const isMobile = useIsMobile();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isExpanded = !isMobile || isMobileExpanded;

  return (
    <AboutCardAnimation
      tone={tone}
      delay={delay}
      expanded={isExpanded}
      onToggle={
        isMobile
          ? () => setIsMobileExpanded((expanded) => !expanded)
          : undefined
      }
    >
      <div className="home-about__card-icon-wrap flex justify-center mb-6">
        <IconFrame
          size="lg"
          radius="xl"
          tone="neutral"
          interaction="playful"
          className="home-about__card-icon-frame"
        >
          <Icon
            className={`home-about__card-icon ${iconClassByTone[tone]}`}
          />
        </IconFrame>
      </div>

      <Heading
        level={3}
        size="body"
        align="center"
        spacingBottom="md"
        className="home-about__card-title group-hover:text-white transition-colors duration-300"
      >
        {title}
      </Heading>

      {isMobile && (
        <div className="home-about__card-action flex justify-center">
          <IconFrame size="sm" tone="brand" interaction="nudge">
            <ArrowRight
              size={14}
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-90" : ""
              }`}
              aria-hidden="true"
            />
          </IconFrame>
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? "max-h-[64rem] mt-4" : "max-h-0"
        }`}
      >
        <Text
          align="center"
          leading="relaxed"
          className="home-about__card-description group-hover:text-white/90 transition-colors duration-300"
        >
          {description}
        </Text>
      </div>
    </AboutCardAnimation>
  );
}

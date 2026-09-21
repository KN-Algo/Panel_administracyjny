import type { LucideIcon } from "lucide-react";
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
  return (
    <AboutCardAnimation tone={tone} delay={delay}>
      <div className="flex justify-center mb-6">
        <IconFrame
          size="lg"
          radius="xl"
          tone="neutral"
          interaction="playful"
        >
          <Icon className={iconClassByTone[tone]} />
        </IconFrame>
      </div>

      <Heading
        level={3}
        size="body"
        align="center"
        spacingBottom="md"
        className="group-hover:text-white transition-colors duration-300"
      >
        {title}
      </Heading>

      <Text
        leading="relaxed"
        className="group-hover:text-white/90 transition-colors duration-300"
      >
        {description}
      </Text>
    </AboutCardAnimation>
  );
}

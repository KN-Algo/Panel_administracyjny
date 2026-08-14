import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { Code, Lightbulb, FlaskConical } from "lucide-react";
import { Heading, IconFrame, Surface, Text } from "@/shared";

interface TileProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

function AnimatedTile({
  icon,
  title,
  description,
  gradient,
  delay,
}: TileProps) {
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
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <IconFrame
            size="lg"
            radius="xl"
            tone="neutral"
            interaction="playful"
          >
            {icon}
          </IconFrame>
        </div>

        <Heading
          level={3}
          size="body"
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
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
    </Surface>
  );
}

export default function AboutSection() {
  const { t } = useTranslation();

  const tiles = [
    {
      icon: (
        <Code className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
      ),
      title: t("home.about_tile1_title"),
      description: t("home.about_tile1_desc"),
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      delay: 0,
    },
    {
      icon: (
        <Lightbulb className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
      ),
      title: t("home.about_tile2_title"),
      description: t("home.about_tile2_desc"),
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      delay: 150,
    },
    {
      icon: (
        <FlaskConical className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
      ),
      title: t("home.about_tile3_title"),
      description: t("home.about_tile3_desc"),
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      delay: 300,
    },
  ];

  return (
    <div className="relative w-full py-20 bg-gradient-to-b from-gray-50 to-white z-10">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16 group cursor-default">
          <Heading
            level={2}
            size="feature"
            align="center"
            spacingBottom="lg"
            tracking="tight"
            className="transition-all duration-300 group-hover:scale-[1.02]"
          >
            {t("home.about_title")}
          </Heading>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 mx-auto rounded-full mb-6 shadow-sm transition-all duration-500 group-hover:w-48 group-hover:shadow-md"></div>
          <Text
            size="xl"
            tone="muted"
            weight="light"
            align="center"
            leading="relaxed"
            className="max-w-3xl mx-auto"
          >
            {t("home.about_subtitle")}
          </Text>
        </div>

        {/* Animated Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tiles.map((tile) => (
            <AnimatedTile key={tile.title} {...tile} />
          ))}
        </div>

        {/* Bottom text */}
        <div className="text-center max-w-4xl mx-auto">
          <Surface
            tone="subtle"
            radius="2xl"
            padding="featured"
            border="subtle"
            interaction="liftGentle"
            cursor="default"
          >
            <Text size="lg" leading="relaxed">
              {t("home.about_footer_text")}
            </Text>
          </Surface>
        </div>
      </div>
    </div>
  );
}

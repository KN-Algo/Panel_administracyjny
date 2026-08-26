import { Heading, Text } from "@/shared";

export interface AboutHeaderProps {
  title: string;
  subtitle: string;
}

export default function AboutHeader({ title, subtitle }: AboutHeaderProps) {
  return (
    <div className="text-center mb-16 group cursor-default">
      <Heading
        level={2}
        size="feature"
        align="center"
        spacingBottom="lg"
        tracking="tight"
        className="transition-all duration-300 group-hover:scale-[1.02]"
      >
        {title}
      </Heading>
      <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 mx-auto rounded-full mb-6 shadow-sm transition-all duration-500 group-hover:w-48 group-hover:shadow-md" />
      <Text
        size="xl"
        tone="muted"
        weight="light"
        align="center"
        leading="relaxed"
        className="max-w-3xl mx-auto"
      >
        {subtitle}
      </Text>
    </div>
  );
}

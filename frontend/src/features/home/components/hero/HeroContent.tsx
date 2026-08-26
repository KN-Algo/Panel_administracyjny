import { ContentContainer, Heading, Text } from "@/shared";

export interface HeroContentProps {
  title: string;
  motto: string;
}

export default function HeroContent({ title, motto }: HeroContentProps) {
  return (
    <ContentContainer align="center" className="relative z-10">
      <Heading
        level={1}
        size="display"
        tone="brandLight"
        align="center"
        spacingBottom="md"
      >
        {title}
      </Heading>
      <Text size="hero" tone="brandLight" align="center">
        {motto}
      </Text>
    </ContentContainer>
  );
}

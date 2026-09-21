import { Surface, Text } from "@/shared";

export interface AboutFooterProps {
  text: string;
}

export default function AboutFooter({ text }: AboutFooterProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <Surface
        tone="subtle"
        radius="2xl"
        padding="featured"
        border="subtle"
        interaction="liftGentle"
        cursor="default"
      >
        <Text size="lg" align="center" leading="relaxed">
          {text}
        </Text>
      </Surface>
    </div>
  );
}

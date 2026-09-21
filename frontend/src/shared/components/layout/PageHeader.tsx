import type { ReactNode } from "react";

import { ContentContainer } from "./ContentContainer";
import { Section } from "./Section";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: "white" | "muted";
}

export function PageHeader({
  title,
  subtitle,
  tone = "white",
}: PageHeaderProps) {
  return (
    <Section tone={tone} align="center">
      <ContentContainer>
        <Heading level={1} size="page" align="center" spacingBottom="md">
          {title}
        </Heading>
        {subtitle ? (
          <Text tone="muted" align="center">
            {subtitle}
          </Text>
        ) : null}
      </ContentContainer>
    </Section>
  );
}

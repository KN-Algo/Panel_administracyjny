import { CalendarDays } from "lucide-react";

import { ContentContainer, Heading, IconFrame, Section, Text } from "@/shared";

interface EventHeaderProps {
  title: string;
  subtitle: string;
}

export default function EventHeader({ title, subtitle }: EventHeaderProps) {
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
          <IconFrame
            size="md"
            radius="xl"
            tone="glass"
            className="mb-3 animate-in fade-in zoom-in-95 [animation-duration:700ms] transition-transform duration-300 ease-out group-hover/header:-rotate-6 group-hover/header:scale-125 motion-reduce:animate-none motion-reduce:transition-none"
          >
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </IconFrame>
          <Heading
            level={1}
            size="page"
            tone="brandLight"
            align="center"
            tracking="tight"
            className="animate-in fade-in slide-in-from-bottom-2 [animation-duration:800ms] [animation-delay:100ms] motion-reduce:animate-none"
          >
            {title}
          </Heading>
          <div
            aria-hidden="true"
            className="my-3 h-1 w-14 rounded-full bg-brand-light-40 animate-in fade-in zoom-in-50 [animation-duration:800ms] [animation-delay:150ms] transition-[width,background-color] duration-300 ease-out group-hover/header:w-32 group-hover/header:bg-brand-light motion-reduce:animate-none motion-reduce:transition-none"
          />
          <Text
            size="base"
            tone="brandLight"
            align="center"
            leading="relaxed"
            className="max-w-xl text-brand-light/80 animate-in fade-in slide-in-from-bottom-2 [animation-duration:800ms] [animation-delay:200ms] motion-reduce:animate-none"
          >
            {subtitle}
          </Text>
        </div>
      </ContentContainer>
    </Section>
  );
}

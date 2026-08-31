import { Button, Heading, Surface, Text } from "@/shared";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  formattedDate: string;
  readMoreLabel: string;
  onOpen: (event: Event) => void;
}

export default function EventCard({
  event,
  formattedDate,
  readMoreLabel,
  onOpen,
}: EventCardProps) {
  return (
    <Surface
      as="button"
      type="button"
      tone="white"
      radius="2xl"
      shadow="lg"
      overflow="hidden"
      cursor="pointer"
      width="full"
      textAlign="left"
      group
      onClick={() => onOpen(event)}
      className="transition-all duration-300 hover:shadow-2xl hover:scale-105"
    >
      <div className="h-64 bg-neutral-lighter flex items-center justify-center overflow-hidden">
        <img
          src={event.thumbnail.replace("../img/", "/img/")}
          alt={event.title}
          style={{ objectPosition: event.thumbnailPosition ?? "center 35%" }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <Heading
          level={3}
          size="body"
          spacingBottom="xs"
          className="line-clamp-2"
        >
          {event.title}
        </Heading>
        <Text size="sm" tone="muted" spacingBottom="lg">
          {formattedDate}
        </Text>
        <Button asChild appearance="text" size="inline">
          <span>{readMoreLabel} →</span>
        </Button>
      </div>
    </Surface>
  );
}

import { ContentContainer, Section } from "@/shared";
import type { Event } from "@/types";

import EventCard from "./EventCard";

interface EventGridProps {
  events: Event[];
  formatDate: (date: string) => string;
  readMoreLabel: string;
  onEventOpen: (event: Event) => void;
}

export default function EventGrid({
  events,
  formatDate,
  readMoreLabel,
  onEventOpen,
}: EventGridProps) {
  return (
    <Section>
      <ContentContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              formattedDate={formatDate(event.date)}
              readMoreLabel={readMoreLabel}
              onOpen={onEventOpen}
            />
          ))}
        </div>
      </ContentContainer>
    </Section>
  );
}

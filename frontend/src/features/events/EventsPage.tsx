import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays } from "lucide-react";

import eventsDataDe from "@/data/events_de.json";
import eventsDataEn from "@/data/events_en.json";
import eventsDataPl from "@/data/events_pl.json";
import { FeaturePageHeader, PublicPage } from "@/shared";
import type { Event } from "@/types";

import EventDialog from "./components/EventDialog";
import EventGrid from "./components/EventGrid";
import { useEventDialog } from "./hooks/useEventDialog";

export default function EventsPage() {
  const { t, i18n } = useTranslation();
  const events = useMemo(() => {
    if (i18n.language === "en") return eventsDataEn as Event[];
    if (i18n.language === "de") return eventsDataDe as Event[];
    return eventsDataPl as Event[];
  }, [i18n.language]);
  const eventDialog = useEventDialog(events);

  const formatDate = (dateString: string) => {
    const locale =
      i18n.language === "en"
        ? "en-US"
        : i18n.language === "de"
          ? "de-DE"
          : "pl-PL";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PublicPage tone="muted" minHeight="screen">
      <FeaturePageHeader
        title={t("events.page_title")}
        subtitle={t("events.page_subtitle")}
        icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
      />
      <EventGrid
        events={events}
        formatDate={formatDate}
        readMoreLabel={t("events.read_more")}
        onEventOpen={eventDialog.openEvent}
      />
      <EventDialog
        event={eventDialog.selectedEvent}
        isOpen={eventDialog.isEventOpen}
        onClose={eventDialog.closeEvent}
        gallery={eventDialog.gallery}
      />
    </PublicPage>
  );
}

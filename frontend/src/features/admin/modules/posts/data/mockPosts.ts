import eventsPl from "@/data/events_pl.json";
import eventsEn from "@/data/events_en.json";
import eventsDe from "@/data/events_de.json";
import { LANGS, createEmptyDraft } from "../model/constants";
import type { LangCode, PostDraft, PostRow } from "../model/types";

// dane tymczasowe z JSON-ów strony - do podmiany na GET /api/posts

type RawEvent = (typeof eventsPl)[number];

const EVENTS_BY_LANG: Record<LangCode, RawEvent[]> = {
  pl: eventsPl,
  en: eventsEn,
  de: eventsDe,
};

// Mock authors since the JSON doesn't have them
const AUTHORS = ["admin", "Jakub B.", "Adrian G.", "Paweł K."] as const;

export const mockPosts: PostRow[] = eventsPl.map((event, i) => ({
  id: event.id,
  title: event.title,
  date: event.date,
  author: AUTHORS[i % AUTHORS.length],
  isActive: true,
  showInNews: i < 5,
}));

// JSON-y mają ścieżki względne ("../img/...") - w panelu muszą być od korzenia
const toAbsoluteUrl = (url: string) => url.replace(/^(\.\.\/)+/, "/");

export function getMockPostDraft(id: string): PostDraft | null {
  const base = eventsPl.find((event) => event.id === id);
  if (!base) return null;

  const empty = createEmptyDraft();
  return {
    ...empty,
    postType: "STANDARD",
    thumbnailUrl: toAbsoluteUrl(base.thumbnail),
    imageUrls: (base.images ?? []).map(toAbsoluteUrl),
    translations: LANGS.map(({ code }) => {
      const event = EVENTS_BY_LANG[code].find((e) => e.id === id);
      return {
        languageCode: code,
        title: event?.title ?? "",
        shortDescription: "",
        fullDescription: event?.description ?? "",
      };
    }),
  };
}

import type { LangCode, PostDraft, PostType, Translation } from "./types";

export const LANGS: { code: LangCode; label: string; name: string }[] = [
  { code: "pl", label: "PL", name: "polski" },
  { code: "en", label: "EN", name: "angielski" },
  { code: "de", label: "DE", name: "niemiecki" },
];

// czytelne nazwy typów zamiast surowych wartości z API (nazwy do potwierdzenia z backendem)
export const POST_TYPE_META: Record<
  PostType,
  { label: string; description: string }
> = {
  STANDARD: { label: "Post", description: "Zwykły wpis na stronie." },
  NEWS: {
    label: "Aktualność",
    description: "Wpis widoczny w sekcji aktualności.",
  },
  TEMP: {
    label: "Modal (popup)",
    description: "Wyskakujące okno wyświetlane w wybranym okresie.",
  },
  TEMP_STANDARD: {
    label: "Post czasowy",
    description: "Zwykły wpis widoczny w wybranym okresie.",
  },
  TEMP_NEWS: {
    label: "Aktualność czasowa",
    description: "Aktualność widoczna w wybranym okresie.",
  },
};

export const POST_TYPES = Object.keys(POST_TYPE_META) as PostType[];

// typy czasowe czyli modale i ogłoszenia wymagają dat: startsAt, expiresAt, eventDate
const TEMP_TYPES: PostType[] = ["TEMP", "TEMP_STANDARD", "TEMP_NEWS"];
export const isTempType = (type: PostType) => TEMP_TYPES.includes(type);

export const createEmptyDraft = (): PostDraft => ({
  postType: "TEMP",
  eventDate: "",
  startsAt: "",
  expiresAt: "",
  noExpiry: false,
  thumbnailUrl: "",
  imageUrls: [],
  externalLink: "",
    translations: Object.fromEntries(
    LANGS.map(({ code }) => [
      code,
      {
        languageCode: code,
        title: "",
        shortDescription: "",
        fullDescription: "",
      },
    ]),
  ) as Record<LangCode, Translation>,

});

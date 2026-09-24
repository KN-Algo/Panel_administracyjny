export type LangCode = "pl" | "en" | "de";

// typy zgodne z dokumentacją backendu (backend/docs/API_GUIDE.md)
export type PostType =
  | "STANDARD"
  | "NEWS"
  | "TEMP"
  | "TEMP_STANDARD"
  | "TEMP_NEWS";

export interface Translation {
  languageCode: LangCode;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

export type TranslationField = keyof Omit<Translation, "languageCode">;

export interface PostDraft {
  postType: PostType;
  eventDate: string;
  startsAt: string;
  expiresAt: string;
  // tylko UI - nie jest wysyłane do API (backend wymaga expiresAt dla TEMP*, do ustalenia przy podpinaniu)
  noExpiry: boolean;
  thumbnailUrl: string;
  imageUrls: string[];
  // Krystian chciał usunąć to pole - zostaje zgodnie z przykładowym payloadem z dokumentacji
  externalLink: string;
  translations: Record<LangCode, Translation>;
}

export type DateField = "eventDate" | "startsAt" | "expiresAt";

export interface PostDraftErrors {
  // ogólny komunikat dla sekcji tłumaczeń
  translations?: string;
  langs: Partial<
    Record<LangCode, Partial<Record<"title" | "fullDescription", string>>>
  >;
  dates: Partial<Record<DateField, string>>;
}

// wiersz tabeli na liście postów
export interface PostRow {
  id: string;
  title: string;
  date: string;
  author: string;
  isActive: boolean;
  showInNews: boolean;
}

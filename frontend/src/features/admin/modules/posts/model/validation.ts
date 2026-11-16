import { LANGS, isTempType } from "./constants";
import type {
  LangCode,
  PostDraft,
  PostDraftErrors,
  Translation,
} from "./types";

// edytor zostawia same <br> po wyczyszczeniu treści - liczy się tylko tekst
const htmlToText = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

export const isTranslationComplete = (t: Translation) =>
  t.title.trim() !== "" && htmlToText(t.fullDescription) !== "";

const isTranslationEmpty = (t: Translation) =>
  t.title.trim() === "" &&
  htmlToText(t.fullDescription) === "" &&
  t.shortDescription.trim() === "";

export const getTranslation = (draft: PostDraft, lang: LangCode) =>
  draft.translations[lang];

export const getMissingLangs = (draft: PostDraft) =>
  LANGS.filter((l) => !isTranslationComplete(getTranslation(draft, l.code)));

// wg API_GUIDE: wymagane postType + min. jedno pełne tłumaczenie (title + fullDescription),
// a dla typów czasowych dodatkowo eventDate, startsAt i expiresAt
export function validatePostDraft(draft: PostDraft): PostDraftErrors {
  const errors: PostDraftErrors = { langs: {}, dates: {} };

  const hasComplete = Object.values(draft.translations).some(isTranslationComplete);

  for (const t of Object.values(draft.translations)) {
    // puste języki pomijamy, ale zaczęte tłumaczenie musi być kompletne
    const mustValidate = hasComplete
      ? !isTranslationEmpty(t)
      : t.languageCode === "pl";
    if (!mustValidate) continue;

    const langErrors: Partial<Record<"title" | "fullDescription", string>> = {};
    if (t.title.trim() === "") langErrors.title = "Podaj tytuł.";
    if (htmlToText(t.fullDescription) === "")
      langErrors.fullDescription = "Podaj treść posta.";
    if (Object.keys(langErrors).length > 0)
      errors.langs[t.languageCode] = langErrors;
  }

  if (!hasComplete) {
    errors.translations = "Dodaj tytuł i treść w co najmniej jednym języku.";
  }

  if (isTempType(draft.postType)) {
    if (!draft.eventDate) errors.dates.eventDate = "Podaj datę wydarzenia.";
    if (!draft.startsAt)
      errors.dates.startsAt = "Podaj datę rozpoczęcia publikacji.";
    if (!draft.noExpiry) {
      if (!draft.expiresAt) {
        errors.dates.expiresAt =
          "Podaj datę wygaśnięcia lub zaznacz „Nie wygasa”.";
      } else if (draft.startsAt && draft.expiresAt <= draft.startsAt) {
        errors.dates.expiresAt =
          "Data wygaśnięcia musi być późniejsza niż początek publikacji.";
      }
    }
  }

  return errors;
}

export const hasErrors = (errors: PostDraftErrors) =>
  Boolean(errors.translations) ||
  Object.keys(errors.langs).length > 0 ||
  Object.keys(errors.dates).length > 0;

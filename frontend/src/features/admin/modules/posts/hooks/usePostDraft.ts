import { useEffect, useMemo, useState } from "react";
import { createEmptyDraft } from "../model/constants";
import type { LangCode, PostDraft, TranslationField } from "../model/types";
import { hasErrors, validatePostDraft } from "../model/validation";

export function usePostDraft(initialValues?: PostDraft) {
  const [draft, setDraft] = useState<PostDraft>(
    () => initialValues ?? createEmptyDraft(),
  );
  // błędy pokazujemy dopiero po pierwszej próbie zapisu, potem na bieżąco
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // migawka ostatnio zapisanego stanu - do wykrywania niezapisanych zmian
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(draft),
  );

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== savedSnapshot,
    [draft, savedSnapshot],
  );
  const allErrors = useMemo(() => validatePostDraft(draft), [draft]);
  const errors = submitAttempted ? allErrors : { langs: {}, dates: {} };

  const updateField = <K extends keyof PostDraft>(
    field: K,
    value: PostDraft[K],
  ) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateTranslation = (
    lang: LangCode,
    field: TranslationField,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.languageCode === lang ? { ...t, [field]: value } : t,
      ),
    }));
  };

  const addImages = (urls: string[]) => {
    setDraft((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
  };

  const removeImage = (idx: number) => {
    setDraft((prev) => {
      const url = prev.imageUrls[idx];
      return {
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
        // jeśli usuwamy zdjęcie ustawione jako miniatura to wybór miniatury musi się wyczyścić
        thumbnailUrl: prev.thumbnailUrl === url ? "" : prev.thumbnailUrl,
      };
    });
  };

  // zwraca true, gdy szkic jest poprawny
  const validate = () => {
    setSubmitAttempted(true);
    return !hasErrors(allErrors);
  };

  const markSaved = () => {
    setSavedSnapshot(JSON.stringify(draft));
    setSubmitAttempted(false);
  };

  // ostrzeżenie przeglądarki przy zamykaniu karty z niezapisanymi zmianami
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return {
    draft,
    errors,
    isDirty,
    updateField,
    updateTranslation,
    addImages,
    removeImage,
    validate,
    markSaved,
  };
}

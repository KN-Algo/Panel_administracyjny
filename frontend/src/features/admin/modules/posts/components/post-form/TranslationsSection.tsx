import { Input } from "@/components/ui/input";
import { FormField } from "@/features/admin/components/form/FormField";
import { FormSection } from "@/features/admin/components/form/FormSection";
import { RichTextEditor } from "@/features/admin/components/form/rich-text-editor/RichTextEditor";
import type {
  LangCode,
  PostDraft,
  PostDraftErrors,
  TranslationField,
} from "../../model/types";
import {
  getMissingLangs,
  getTranslation,
  isTranslationComplete,
} from "../../model/validation";
import { LanguageTabs } from "./LanguageTabs";
import { TranslationStatus } from "./TranslationStatus";

interface TranslationsSectionProps {
  draft: PostDraft;
  errors: PostDraftErrors;
  activeLang: LangCode;
  onActiveLangChange: (lang: LangCode) => void;
  onChange: (lang: LangCode, field: TranslationField, value: string) => void;
}

export function TranslationsSection({
  draft,
  errors,
  activeLang,
  onActiveLangChange,
  onChange,
}: TranslationsSectionProps) {
  const missingLangs = getMissingLangs(draft).map((l) => l.code);

  return (
    <FormSection
      title="Treść posta"
      aside={<TranslationStatus missingLangs={missingLangs} />}
    >
      {errors.translations && (
        <p role="alert" className="text-sm text-destructive">
          {errors.translations}
        </p>
      )}

      <LanguageTabs
        value={activeLang}
        onValueChange={onActiveLangChange}
        isComplete={(lang) =>
          isTranslationComplete(getTranslation(draft, lang))
        }
        hasError={(lang) => Boolean(errors.langs[lang])}
      >
        {(lang) => {
          const translation = getTranslation(draft, lang);
          const langErrors = errors.langs[lang] ?? {};
          const suffix = (
            <span className="font-normal text-muted-foreground">
              ({lang.toUpperCase()})
            </span>
          );

          return (
            <>
              <FormField
                label={<>Tytuł {suffix}</>}
                required
                error={langErrors.title}
              >
                {(control) => (
                  <Input
                    {...control}
                    value={translation.title}
                    onChange={(e) => onChange(lang, "title", e.target.value)}
                    placeholder="Tytuł posta..."
                  />
                )}
              </FormField>

              <FormField
                label={<>Krótki opis {suffix}</>}
                hint="Opcjonalnie. Wyświetlany na liście postów."
              >
                {(control) => (
                  <Input
                    {...control}
                    value={translation.shortDescription}
                    onChange={(e) =>
                      onChange(lang, "shortDescription", e.target.value)
                    }
                    placeholder="Krótki opis..."
                  />
                )}
              </FormField>

              <FormField
                label={<>Pełna treść {suffix}</>}
                required
                error={langErrors.fullDescription}
              >
                {(control) => (
                  <RichTextEditor
                    {...control}
                    value={translation.fullDescription}
                    onChange={(html) => onChange(lang, "fullDescription", html)}
                    placeholder="Treść posta..."
                  />
                )}
              </FormField>
            </>
          );
        }}
      </LanguageTabs>
    </FormSection>
  );
}

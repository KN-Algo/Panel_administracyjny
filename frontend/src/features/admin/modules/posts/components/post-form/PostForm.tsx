import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { ADMIN_PATHS } from "@/features/admin/config/paths";
import { usePostDraft } from "../../hooks/usePostDraft";
import { LANGS } from "../../model/constants";
import type { LangCode, PostDraft } from "../../model/types";
import { validatePostDraft } from "../../model/validation";
import { PostMediaSection } from "./PostMediaSection";
import { PostSettingsSection } from "./PostSettingsSection";
import { TranslationsSection } from "./TranslationsSection";

interface PostFormProps {
  initialValues?: PostDraft;
  submitLabel: string;
  onSubmit: (draft: PostDraft) => void;
}

type SubmitStatus = "idle" | "invalid" | "saved";

export function PostForm({
  initialValues,
  submitLabel,
  onSubmit,
}: PostFormProps) {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeLang, setActiveLang] = useState<LangCode>("pl");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [confirmLeave, setConfirmLeave] = useState(false);

  const post = usePostDraft(initialValues);
  const { draft, errors, isDirty } = post;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!post.validate()) {
      // przełącz na pierwszy język z błędami i przewiń do pierwszego błędnego pola
      const langErrors = validatePostDraft(draft).langs;
      const firstLangWithError = LANGS.find((l) => langErrors[l.code]);
      if (firstLangWithError) setActiveLang(firstLangWithError.code);
      setStatus("invalid");
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>("[aria-invalid='true']")
          ?.focus();
      });
      return;
    }

    onSubmit(draft);
    post.markSaved();
    setStatus("saved");
  };

  const handleCancel = () => {
    if (isDirty) setConfirmLeave(true);
    else navigate(ADMIN_PATHS.posts);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4"
    >
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
        <TranslationsSection
          draft={draft}
          errors={errors}
          activeLang={activeLang}
          onActiveLangChange={setActiveLang}
          onChange={(...args) => {
            post.updateTranslation(...args);
            setStatus("idle");
          }}
        />

        <div className="space-y-4">
          <PostSettingsSection
            draft={draft}
            errors={errors}
            onChange={(field, value) => {
              post.updateField(field, value);
              setStatus("idle");
            }}
          />
          <PostMediaSection
            draft={draft}
            onAddImages={post.addImages}
            onRemoveImage={post.removeImage}
            onThumbnailChange={(url) => post.updateField("thumbnailUrl", url)}
          />
        </div>
      </div>

      {/* pasek akcji przyklejony do dołu obszaru przewijania; ujemny bottom/mx = padding <main> z AdminLayout */}
      <div className="sticky -bottom-4 z-10 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur md:-bottom-6 md:-mx-6 md:px-6">
        {status === "invalid" && (
          <p
            role="alert"
            className="mr-auto flex items-center gap-1.5 text-sm text-destructive"
          >
            <AlertCircle className="size-4" />
            Popraw zaznaczone pola.
          </p>
        )}
        {status === "saved" && (
          <p
            role="status"
            className="mr-auto flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="size-4 text-green-600" />
            Post jest poprawny. Zapis do API zostanie podłączony w kolejnym
            etapie.
          </p>
        )}
        {status === "idle" && isDirty && (
          <p className="mr-auto text-sm text-muted-foreground">
            Niezapisane zmiany
          </p>
        )}
        <Button type="button" variant="outline" onClick={handleCancel}>
          Anuluj
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>

      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        title="Porzucić zmiany?"
        description="Masz niezapisane zmiany w tym poście. Jeśli wyjdziesz, zostaną utracone."
        confirmLabel="Porzuć zmiany"
        cancelLabel="Wróć do edycji"
        destructive
        onConfirm={() => navigate(ADMIN_PATHS.posts)}
      />
    </form>
  );
}

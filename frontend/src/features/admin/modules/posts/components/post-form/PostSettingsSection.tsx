import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/features/admin/components/form/FormField";
import { FormSection } from "@/features/admin/components/form/FormSection";
import { POST_TYPES, POST_TYPE_META, isTempType } from "../../model/constants";
import type { PostDraft, PostDraftErrors, PostType } from "../../model/types";

interface PostSettingsSectionProps {
  draft: PostDraft;
  errors: PostDraftErrors;
  onChange: <K extends keyof PostDraft>(field: K, value: PostDraft[K]) => void;
}

export function PostSettingsSection({
  draft,
  errors,
  onChange,
}: PostSettingsSectionProps) {
  const showTempFields = isTempType(draft.postType);

  return (
    <FormSection title="Publikacja">
      <FormField
        label="Typ posta"
        hint={POST_TYPE_META[draft.postType].description}
      >
        {(control) => (
          <Select
            value={draft.postType}
            onValueChange={(value) => onChange("postType", value as PostType)}
          >
            <SelectTrigger {...control} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {POST_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {POST_TYPE_META[type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>

      {/* pola dat tylko dla typów czasowych czyli TEMP, TEMP_STANDARD, TEMP_NEWS, tak jak w dokumentacji */}
      {showTempFields && (
        <>
          <FormField
            label="Data wydarzenia"
            required
            error={errors.dates.eventDate}
          >
            {(control) => (
              <Input
                {...control}
                type="datetime-local"
                value={draft.eventDate}
                onChange={(e) => onChange("eventDate", e.target.value)}
              />
            )}
          </FormField>

          <FormField
            label="Publikacja od"
            required
            error={errors.dates.startsAt}
          >
            {(control) => (
              <Input
                {...control}
                type="datetime-local"
                value={draft.startsAt}
                onChange={(e) => onChange("startsAt", e.target.value)}
              />
            )}
          </FormField>

          {/* wygaszanie postów - włącz/wyłącz */}
          <FormField
            label="Publikacja do"
            required={!draft.noExpiry}
            error={errors.dates.expiresAt}
            hint={
              draft.noExpiry
                ? "Post nie będzie automatycznie wygaszany."
                : undefined
            }
            labelAside={
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                <Switch
                  size="sm"
                  checked={draft.noExpiry}
                  onCheckedChange={(checked) => onChange("noExpiry", checked)}
                />
                Nie wygasa
              </label>
            }
          >
            {(control) =>
              draft.noExpiry ? null : (
                <Input
                  {...control}
                  type="datetime-local"
                  value={draft.expiresAt}
                  min={draft.startsAt || undefined}
                  onChange={(e) => onChange("expiresAt", e.target.value)}
                />
              )
            }
          </FormField>
        </>
      )}
    </FormSection>
  );
}

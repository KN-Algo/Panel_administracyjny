import { FormSection } from "@/features/admin/components/form/FormSection";
import { ImageUploadField } from "@/features/admin/components/form/image-upload/ImageUploadField";
import type { PostDraft } from "../../model/types";

interface PostMediaSectionProps {
  draft: PostDraft;
  onAddImages: (urls: string[]) => void;
  onRemoveImage: (idx: number) => void;
  onThumbnailChange: (url: string) => void;
}

export function PostMediaSection({
  draft,
  onAddImages,
  onRemoveImage,
  onThumbnailChange,
}: PostMediaSectionProps) {
  return (
    <FormSection title="Zdjęcia">
      <ImageUploadField
        label="Galeria posta"
        images={draft.imageUrls}
        thumbnailUrl={draft.thumbnailUrl}
        onAdd={onAddImages}
        onRemove={onRemoveImage}
        onThumbnailChange={onThumbnailChange}
      />
    </FormSection>
  );
}

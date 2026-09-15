import { useId } from "react";
import { Label } from "@/components/ui/label";
import { ImageDropzone } from "./ImageDropzone";
import { ImageTile } from "./ImageTile";
import { useImageUpload } from "./useImageUpload";

interface ImageUploadFieldProps {
  label?: string;
  images: string[];
  thumbnailUrl: string;
  onAdd: (urls: string[]) => void;
  onRemove: (index: number) => void;
  onThumbnailChange: (url: string) => void;
}

export function ImageUploadField({
  label = "Zdjęcia",
  images,
  thumbnailUrl,
  onAdd,
  onRemove,
  onThumbnailChange,
}: ImageUploadFieldProps) {
  const id = useId();
  const { upload, uploading, error } = useImageUpload(onAdd);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <ImageDropzone
        id={id}
        uploading={uploading}
        onFiles={(files) => void upload(files)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">
            Kliknij gwiazdkę, aby ustawić miniaturę posta.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {images.map((url, idx) => (
              <ImageTile
                key={`${url}-${idx}`}
                url={url}
                index={idx}
                isThumbnail={thumbnailUrl === url}
                onSetThumbnail={() => onThumbnailChange(url)}
                onRemove={() => onRemove(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

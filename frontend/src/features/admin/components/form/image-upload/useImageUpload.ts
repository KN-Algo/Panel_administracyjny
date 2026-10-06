import { useState } from "react";
import { uploadImages } from "@/features/admin/lib/api/uploads";

export function useImageUpload(onUploaded: (urls: string[]) => void) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (fileList: FileList | File[] | null) => {
    const files = fileList ? Array.from(fileList) : [];
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const { urls, errors } = await uploadImages(files);
      if (urls.length > 0) onUploaded(urls);
      if (errors.length > 0) {
        setError(
          `Nie wgrano: ${errors.map((e) => `${e.filename} (${e.error})`).join(", ")}`,
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się wgrać zdjęć",
      );
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}

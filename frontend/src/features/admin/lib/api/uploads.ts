// upload zdjęć wg backend/docs/API_GUIDE.md (INDEKS W NAZWIE ZDJ NADAJE BACKEND)
export interface UploadResult {
  urls: string[];
  errors: { filename: string; error: string }[];
}

export async function uploadImages(files: File[]): Promise<UploadResult> {
  if (files.length === 0) return { urls: [], errors: [] };

  if (files.length === 1) {
    const fd = new FormData();
    fd.append("file", files[0]);
    const res = await fetch("/api/files/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Błąd wgrywania (${res.status})`);
    const data: { url: string } = await res.json();
    return { urls: [data.url], errors: [] };
  }

  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  const res = await fetch("/api/files/upload/batch", {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(`Błąd wgrywania (${res.status})`);
  const data: {
    successes?: { filename: string; url: string }[];
    errors?: { filename: string; error: string }[];
  } = await res.json();
  return {
    urls: (data.successes ?? []).map((s) => s.url),
    errors: data.errors ?? [],
  };
}

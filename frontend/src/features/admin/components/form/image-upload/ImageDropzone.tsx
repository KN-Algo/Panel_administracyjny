import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  id?: string;
  uploading: boolean;
  onFiles: (files: File[]) => void;
  "aria-describedby"?: string;
}

const toImageFiles = (fileList: FileList | null) =>
  Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));


export function ImageDropzone({
  id,
  uploading,
  onFiles,
  "aria-describedby": ariaDescribedBy,
}: ImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={uploading}
        aria-describedby={ariaDescribedBy}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!uploading) onFiles(toImageFiles(e.dataTransfer.files));
        }}

        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-md border border-dashed px-3 py-5 text-center text-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          uploading ? "cursor-wait" : "cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 text-primary"
            : "border-input text-muted-foreground hover:border-ring hover:bg-accent/40",
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Wgrywanie...
          </>
        ) : (
          <>
            <Upload className="size-4" />
            <span>
              <span className="font-medium text-foreground">
                Kliknij, aby wybrać
              </span>{" "}
              lub przeciągnij zdjęcia
            </span>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        tabIndex={-1}
        onChange={(e) => {
          onFiles(toImageFiles(e.target.files));
          e.target.value = "";
        }}

      />
    </>
  );
}

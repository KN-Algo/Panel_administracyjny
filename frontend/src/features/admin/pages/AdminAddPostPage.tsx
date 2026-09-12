import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilePlus,
  ArrowLeft,
  Upload,
  X,
  GripVertical,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function AdminAddPostPage() {
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Toggles
  const [addToEvents, setAddToEvents] = useState(true);
  const [addToNews, setAddToNews] = useState(false);
  const [isTemporary, setIsTemporary] = useState(false);

  // Conditional fields
  const [newsNote, setNewsNote] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Images
  const [images, setImages] = useState<ImageFile[]>([]);
  const [imagePrefix, setImagePrefix] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag reorder state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateImageName = useCallback(
    (index: number) => {
      const prefix = imagePrefix.trim() || "img";
      return `${prefix}${index + 1}`;
    },
    [imagePrefix],
  );

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const accepted = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const newImages: ImageFile[] = [];

      Array.from(files).forEach((file) => {
        if (!accepted.includes(file.type)) return;

        const id = crypto.randomUUID();
        const preview = URL.createObjectURL(file);
        newImages.push({
          id,
          file,
          preview,
          name: generateImageName(images.length + newImages.length),
        });
      });

      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length, generateImageName],
  );

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      const updated = prev.filter((i) => i.id !== id);
      // Renumber remaining images
      return updated.map((img, idx) => ({
        ...img,
        name: generateImageName(idx),
      }));
    });
  };

  // Drag & drop handlers for file upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };

  // Drag reorder handlers
  const handleReorderDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleReorderDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    setImages((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(draggedIdx, 1);
      updated.splice(idx, 0, dragged);
      return updated.map((img, i) => ({
        ...img,
        name: generateImageName(i),
      }));
    });
    setDraggedIdx(idx);
  };

  const handleReorderDragEnd = () => {
    setDraggedIdx(null);
  };

  // Update all image names when prefix changes
  const handlePrefixChange = (newPrefix: string) => {
    setImagePrefix(newPrefix);
    const prefix = newPrefix.trim() || "img";
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        name: `${prefix}${idx + 1}`,
      })),
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Tytuł jest wymagany";
    if (isTemporary && !expiryDate)
      newErrors.expiryDate = "Podaj datę wygaśnięcia";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Collect form data (ready for backend)
    const postData = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      date,
      addToEvents,
      addToNews,
      newsNote: addToNews ? newsNote.trim() : "",
      isTemporary,
      expiryDate: isTemporary ? expiryDate : null,
      imageCount: images.length,
    };

    console.log("Post data ready for backend:", postData);
    console.log("Images to upload:", images.map((i) => ({ name: i.name, file: i.file.name, size: i.file.size })));

    // TODO: Send to backend
    alert("Post zapisany (mock) — dane w konsoli");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/panel/admin/events")}
          title="Wróć do listy wydarzeń"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <FilePlus className="h-6 w-6 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-semibold">Dodaj nowy wpis</h2>
          <p className="text-sm text-muted-foreground">
            Uzupełnij dane i opublikuj nowy post.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info section */}
        <section className="space-y-4 rounded-lg border p-4 md:p-6">
          <h3 className="text-lg font-medium">Dane podstawowe</h3>
          <Separator />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tytuł wpisu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wpisz tytuł..."
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Treść</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Opis wewnętrzny, notatki..."
              rows={4}
            />
          </div>

          {/* Author + Date row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="author">Autor</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Informacja wewnętrzna — nie wyświetla się na stronie.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Imię i nazwisko"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data publikacji</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Toggles section */}
        <section className="space-y-4 rounded-lg border p-4 md:p-6">
          <h3 className="text-lg font-medium">Ustawienia wyświetlania</h3>
          <Separator />

          {/* Add to events */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="events-toggle">Dodaj do wydarzeń</Label>
              <p className="text-sm text-muted-foreground">
                Post pojawi się na liście wydarzeń.
              </p>
            </div>
            <Switch
              id="events-toggle"
              checked={addToEvents}
              onCheckedChange={setAddToEvents}
            />
          </div>

          <Separator />

          {/* Add to news */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="news-toggle">Dodaj do aktualności</Label>
                <p className="text-sm text-muted-foreground">
                  Post pojawi się w sekcji aktualności na stronie głównej.
                </p>
              </div>
              <Switch
                id="news-toggle"
                checked={addToNews}
                onCheckedChange={setAddToNews}
              />
            </div>

            {addToNews && (
              <div className="ml-4 space-y-2 border-l-2 pl-4">
                <Label htmlFor="news-note">Krótki dopisek do aktualności</Label>
                <Textarea
                  id="news-note"
                  value={newsNote}
                  onChange={(e) => setNewsNote(e.target.value)}
                  placeholder="Wyświetli się pod tytułem w aktualnościach..."
                  rows={2}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Temporary post */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="temporary-toggle">Post tymczasowy</Label>
                <p className="text-sm text-muted-foreground">
                  Post zostanie automatycznie usunięty po określonym czasie.
                </p>
              </div>
              <Switch
                id="temporary-toggle"
                checked={isTemporary}
                onCheckedChange={setIsTemporary}
              />
            </div>

            {isTemporary && (
              <div className="ml-4 space-y-2 border-l-2 pl-4">
                <Label htmlFor="expiry-date">Data wygaśnięcia</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  aria-invalid={!!errors.expiryDate}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-destructive">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Images section */}
        <section className="space-y-4 rounded-lg border p-4 md:p-6">
          <h3 className="text-lg font-medium">Zdjęcia</h3>
          <Separator />

          {/* Image name prefix */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="image-prefix">Prefiks nazw zdjęć</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Zdjęcia będą nazwane: prefiks1, prefiks2, prefiks3 itd.
                    <br />
                    Np. dla "pwr" → pwr1.webp, pwr2.webp, pwr3.webp
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="image-prefix"
              value={imagePrefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
              placeholder="np. pwr, event, algo..."
              className="max-w-xs"
            />
          </div>

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Przeciągnij pliki lub kliknij, aby wybrać
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF, WEBP
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addImages(e.target.files);
              e.target.value = "";
            }}
          />

          {/* Image previews */}
          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {images.length} {images.length === 1 ? "zdjęcie" : images.length < 5 ? "zdjęcia" : "zdjęć"} — przeciągnij, aby zmienić kolejność
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleReorderDragStart(idx)}
                    onDragOver={(e) => handleReorderDragOver(e, idx)}
                    onDragEnd={handleReorderDragEnd}
                    className={`group relative rounded-lg border bg-muted/30 transition-opacity ${
                      draggedIdx === idx ? "opacity-50" : ""
                    }`}
                  >
                    {/* Drag handle */}
                    <div className="absolute top-1 left-1 cursor-grab rounded bg-black/50 p-0.5 opacity-0 group-hover:opacity-100">
                      <GripVertical className="size-3.5 text-white" />
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    >
                      <X className="size-3.5 text-white" />
                    </button>

                    <img
                      src={img.preview}
                      alt={img.name}
                      className="aspect-square w-full rounded-t-lg object-cover"
                    />
                    <p className="truncate px-2 py-1.5 text-center text-xs font-medium">
                      {img.name}.webp
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/panel/admin/events")}
          >
            Anuluj
          </Button>
          <Button type="submit">
            <FilePlus className="size-4" />
            Opublikuj wpis
          </Button>
        </div>
      </form>
    </div>
  );
}

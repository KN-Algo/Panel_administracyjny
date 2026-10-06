import { Image as ImageIcon, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageTileProps {
  url: string;
  index: number;
  isThumbnail: boolean;
  onSetThumbnail: () => void;
  onRemove: () => void;
}

// przyciski widoczne na hover, przy fokusie klawiatury i zawsze na urządzeniach dotykowych
const tileButtonClass =
  "absolute top-1 flex size-6 items-center justify-center rounded bg-background/90 shadow-xs transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5";
const revealClass =
  "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

export function ImageTile({
  url,
  index,
  isThumbnail,
  onSetThumbnail,
  onRemove,
}: ImageTileProps) {
  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-md border bg-muted",
        isThumbnail && "ring-2 ring-primary ring-offset-1 ring-offset-card",
      )}
    >
      <ImageIcon className="absolute inset-0 m-auto size-5 text-muted-foreground/40" />
      <img
        src={url}
        alt={`Zdjęcie ${index + 1}`}
        className="relative h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
      <button
        type="button"
        aria-label={
          isThumbnail
            ? "Miniatura posta"
            : `Ustaw zdjęcie ${index + 1} jako miniaturę`
        }
        aria-pressed={isThumbnail}
        title={isThumbnail ? "Miniatura posta" : "Ustaw jako miniaturę"}
        onClick={onSetThumbnail}
        className={cn(
          tileButtonClass,
          "left-1",
          isThumbnail
            ? "text-primary opacity-100 [&_svg]:fill-primary"
            : cn("text-muted-foreground hover:text-primary", revealClass),
        )}
      >
        <Star />
      </button>
      <button
        type="button"
        aria-label={`Usuń zdjęcie ${index + 1}`}
        title="Usuń zdjęcie"
        onClick={onRemove}
        className={cn(
          tileButtonClass,
          "right-1 text-muted-foreground hover:text-destructive",
          revealClass,
        )}
      >
        <X />
      </button>
      {isThumbnail && (
        <span className="absolute inset-x-0 bottom-0 bg-primary/85 py-0.5 text-center text-[10px] leading-none font-medium text-primary-foreground">
          Miniatura
        </span>
      )}
    </div>
  );
}

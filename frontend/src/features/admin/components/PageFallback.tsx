import { Skeleton } from "@/components/ui/skeleton";

// placeholder na czas doładowania strony (React.lazy)
export function PageFallback() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Ładowanie strony">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  children: ReactNode;
}

// pasek akcji zbiorczych - pokazywany tylko gdy coś jest zaznaczone
export function BulkActionsBar({
  count,
  onClear,
  children,
}: BulkActionsBarProps) {
  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-label="Akcje dla zaznaczonych"
      className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2"
    >
      <span className="text-sm font-medium">Zaznaczono: {count}</span>
      <Button variant="ghost" size="xs" onClick={onClear}>
        <X />
        Odznacz
      </Button>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  );
}

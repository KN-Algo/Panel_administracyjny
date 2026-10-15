import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortDir } from "./useSortState";

interface SortableColumnHeaderProps {
  label: string;
  sortDir: SortDir;
  onToggle: () => void;
}

const SORT_META = {
  asc: { icon: ArrowUp, description: "rosnąco" },
  desc: { icon: ArrowDown, description: "malejąco" },
  none: { icon: ArrowUpDown, description: "brak sortowania" },
} as const;

export function SortableColumnHeader({
  label,
  sortDir,
  onToggle,
}: SortableColumnHeaderProps) {
  const { icon: Icon, description } = SORT_META[sortDir ?? "none"];

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={onToggle}
      aria-label={`${label}: sortowanie ${description}`}
    >
      {label}
      <Icon className="size-3.5" />
    </Button>
  );
}

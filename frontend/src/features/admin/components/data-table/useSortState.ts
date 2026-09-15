import { useState } from "react";

export type SortDir = "asc" | "desc" | null;

// kliknięcie w nagłówek: malejąco → rosnąco → bez sortowania
const NEXT_DIR: Record<"asc" | "desc" | "none", SortDir> = {
  desc: "asc",
  asc: null,
  none: "desc",
};

export function useSortState(initial: SortDir = "desc") {
  const [sortDir, setSortDir] = useState<SortDir>(initial);
  const cycleSortDir = () => setSortDir((prev) => NEXT_DIR[prev ?? "none"]);
  return { sortDir, cycleSortDir };
}

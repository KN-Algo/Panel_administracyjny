import { useMemo, useState } from "react";

// zaznaczanie wierszy liczone względem aktualnie widocznych (przefiltrowanych) id
export function useRowSelection(visibleIds: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const selectedVisible = useMemo(
    () => visibleIds.filter((id) => selected.has(id)),
    [visibleIds, selected],
  );

  const allSelected =
    visibleIds.length > 0 && selectedVisible.length === visibleIds.length;
  const someSelected = selectedVisible.length > 0;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(visibleIds));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clear = () => setSelected(new Set());

  return {
    isSelected: (id: string) => selected.has(id),
    selectedIds: selectedVisible,
    allSelected,
    someSelected,
    // stan checkboxa "zaznacz wszystkie"
    headerCheckedState: allSelected
      ? true
      : someSelected
        ? ("indeterminate" as const)
        : false,
    toggleAll,
    toggleOne,
    clear,
  };
}

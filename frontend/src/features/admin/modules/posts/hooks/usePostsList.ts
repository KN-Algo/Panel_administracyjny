import { useMemo, useState } from "react";
import { useSortState } from "@/features/admin/components/data-table/useSortState";
import type { PostRow } from "../model/types";

export function usePostsList(posts: PostRow[]) {
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string | null>(null);
  const { sortDir, cycleSortDir } = useSortState("desc");

  const authors = useMemo(
    () => [...new Set(posts.map((p) => p.author))],
    [posts],
  );

  const visiblePosts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pl");
    let result = posts.filter(
      (p) =>
        (!authorFilter || p.author === authorFilter) &&
        (!query || p.title.toLocaleLowerCase("pl").includes(query)),
    );

    if (sortDir) {
      result = [...result].sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortDir === "asc" ? diff : -diff;
      });
    }

    return result;
  }, [posts, search, authorFilter, sortDir]);

  const hasActiveFilters = search.trim() !== "" || authorFilter !== null;

  const clearFilters = () => {
    setSearch("");
    setAuthorFilter(null);
  };

  return {
    visiblePosts,
    totalCount: posts.length,
    authors,
    search,
    setSearch,
    authorFilter,
    setAuthorFilter,
    sortDir,
    cycleSortDir,
    hasActiveFilters,
    clearFilters,
  };
}

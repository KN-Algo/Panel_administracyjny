import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface PostsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  authors: string[];
  authorFilter: string | null;
  onAuthorFilterChange: (author: string | null) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function PostsToolbar({
  search,
  onSearchChange,
  authors,
  authorFilter,
  onAuthorFilterChange,
  hasActiveFilters,
  onClearFilters,
}: PostsToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Szukaj po tytule..."
          aria-label="Szukaj postów po tytule"
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="max-sm:flex-1">
              {authorFilter ? `Autor: ${authorFilter}` : "Wszyscy autorzy"}
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onAuthorFilterChange(null)}>
              Wszyscy autorzy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {authors.map((author) => (
              <DropdownMenuItem
                key={author}
                onClick={() => onAuthorFilterChange(author)}
              >
                {author}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters}>
            <X />
            Wyczyść filtry
          </Button>
        )}
      </div>
    </div>
  );
}

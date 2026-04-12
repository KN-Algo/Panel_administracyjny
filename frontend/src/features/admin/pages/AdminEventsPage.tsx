import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Plus,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Trash2,
  Power,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import eventsData from "@/data/events_pl.json";

// Mock authors since the JSON doesn't have them
const AUTHORS = ["admin", "Jakub B.", "Adrian G.", "Paweł K."] as const;

interface EventRow {
  id: string;
  title: string;
  date: string;
  author: string;
  isActive: boolean;
  showInNews: boolean;
}

// Enrich raw event data with mock fields
const mockEvents: EventRow[] = eventsData.map((event, i) => ({
  id: event.id,
  title: event.title,
  date: event.date,
  author: AUTHORS[i % AUTHORS.length],
  isActive: true,
  showInNews: i < 5,
}));

type SortDir = "asc" | "desc" | null;

export default function AdminEventsPage() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [authorFilter, setAuthorFilter] = useState<string | null>(null);

  // Unique authors for filter
  const authors = useMemo(
    () => [...new Set(mockEvents.map((e) => e.author))],
    [],
  );

  // Filter + sort
  const events = useMemo(() => {
    let result = [...mockEvents];

    if (authorFilter) {
      result = result.filter((e) => e.author === authorFilter);
    }

    if (sortDir) {
      result.sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortDir === "asc" ? diff : -diff;
      });
    }

    return result;
  }, [sortDir, authorFilter]);

  // Selection helpers
  const allSelected =
    events.length > 0 && events.every((e) => selected.has(e.id));
  const someSelected = events.some((e) => selected.has(e.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(events.map((e) => e.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const cycleSortDir = () => {
    setSortDir((prev) => {
      if (prev === "desc") return "asc";
      if (prev === "asc") return null;
      return "desc";
    });
  };

  const SortIcon =
    sortDir === "asc" ? ArrowUp : sortDir === "desc" ? ArrowDown : ArrowUpDown;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <div>
              <h2 className="text-2xl font-semibold">Wydarzenia</h2>
              <p className="text-sm text-muted-foreground">
                Zarządzanie wydarzeniami — edycja, dodawanie i usuwanie.
              </p>
            </div>
          </div>

          <Button onClick={() => navigate("/panel/admin/add-post")}>
            <Plus />
            Dodaj wydarzenie
          </Button>
        </div>

        {/* Toolbar: filters + bulk actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {/* Select all */}
            <Button variant="outline" size="sm" onClick={toggleAll}>
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                className="pointer-events-none"
                aria-hidden
              />
              {allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
            </Button>

            {/* Author filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {authorFilter
                    ? `Autor: ${authorFilter}`
                    : "Filtruj po autorze"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setAuthorFilter(null)}>
                  Wszyscy autorzy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {authors.map((author) => (
                  <DropdownMenuItem
                    key={author}
                    onClick={() => setAuthorFilter(author)}
                  >
                    {author}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {authorFilter && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setAuthorFilter(null)}
              >
                Wyczyść filtr
              </Button>
            )}
          </div>

          {/* Bulk actions */}
          {someSelected && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Zaznaczono: {selected.size}
              </span>
              <Button variant="outline" size="sm" disabled>
                <Power className="size-3.5" />
                Zmień status
              </Button>
              <Button variant="destructive" size="sm" disabled>
                <Trash2 className="size-3.5" />
                Usuń
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    allSelected ? true : someSelected ? "indeterminate" : false
                  }
                  onCheckedChange={toggleAll}
                  aria-label="Zaznacz wszystkie"
                />
              </TableHead>
              <TableHead className="min-w-[250px]">Tytuł</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3"
                  onClick={cycleSortDir}
                >
                  Data
                  <SortIcon className="size-3.5" />
                </Button>
              </TableHead>
              <TableHead className="text-center">Aktywność</TableHead>
              <TableHead className="text-center">Aktualności</TableHead>
              <TableHead className="w-20 text-center">Akcje</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Brak wydarzeń do wyświetlenia.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  data-state={selected.has(event.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selected.has(event.id)}
                      onCheckedChange={() => toggleOne(event.id)}
                      aria-label={`Zaznacz ${event.title}`}
                    />
                  </TableCell>

                  <TableCell className="font-medium max-w-[350px] truncate">
                    {event.title}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{event.author}</Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDate(event.date)}
                  </TableCell>

                  <TableCell className="text-center">
                    <Switch
                      checked={event.isActive}
                      disabled
                      aria-label="Aktywność"
                    />
                  </TableCell>

                  <TableCell className="text-center">
                    <Switch
                      checked={event.showInNews}
                      disabled
                      aria-label="Pokaż w aktualnościach"
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon-xs" asChild>
                        <a
                          href={`/events#${event.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Podgląd na stronie"
                        >
                          <Eye className="size-3.5" />
                        </a>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal className="size-3.5" />
                            <span className="sr-only">Więcej opcji</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/panel/admin/posts", {
                                state: { eventId: event.id },
                              })
                            }
                          >
                            Edytuj
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" disabled>
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer info */}
      <p className="text-xs text-muted-foreground">
        Wyświetlono {events.length} z {mockEvents.length} wydarzeń
      </p>
    </div>
  );
}

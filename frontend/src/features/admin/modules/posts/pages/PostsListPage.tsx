import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, SearchX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { EmptyState } from "@/features/admin/components/EmptyState";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { BulkActionsBar } from "@/features/admin/components/data-table/BulkActionsBar";
import { useRowSelection } from "@/features/admin/components/data-table/useRowSelection";
import { ADMIN_PATHS } from "@/features/admin/config/paths";
import { pluralize } from "@/features/admin/lib/format";
import { PostsTable } from "../components/PostsTable";
import { PostsToolbar } from "../components/PostsToolbar";
import { mockPosts } from "../data/mockPosts";
import { usePostsList } from "../hooks/usePostsList";
import type { PostRow } from "../model/types";

// usuwanie wymaga podpięcia DELETE /api/posts/{id}
const DELETE_AVAILABLE = false;

export function PostsListPage() {
  const list = usePostsList(mockPosts);
  const selection = useRowSelection(list.visiblePosts.map((p) => p.id));
  // posty czekające na potwierdzenie usunięcia (null = dialog zamknięty)
  const [pendingDelete, setPendingDelete] = useState<PostRow[] | null>(null);

  const selectedPosts = list.visiblePosts.filter((p) =>
    selection.isSelected(p.id),
  );
  const deleteCount = pendingDelete?.length ?? 0;

  const addPostButton = (
    <Button asChild>
      <Link to={ADMIN_PATHS.postNew}>
        <Plus />
        Dodaj post
      </Link>
    </Button>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Calendar}
        title="Posty"
        description="Przeglądaj, edytuj i dodawaj posty widoczne na stronie."
        actions={addPostButton}
      />

      <PostsToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        authors={list.authors}
        authorFilter={list.authorFilter}
        onAuthorFilterChange={list.setAuthorFilter}
        hasActiveFilters={list.hasActiveFilters}
        onClearFilters={list.clearFilters}
      />

      <BulkActionsBar count={selectedPosts.length} onClear={selection.clear}>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setPendingDelete(selectedPosts)}
        >
          <Trash2 />
          Usuń zaznaczone
        </Button>
      </BulkActionsBar>

      <PostsTable
        posts={list.visiblePosts}
        selection={selection}
        sortDir={list.sortDir}
        onSortToggle={list.cycleSortDir}
        onDelete={(post) => setPendingDelete([post])}
        emptyState={
          list.hasActiveFilters ? (
            <EmptyState
              icon={SearchX}
              title="Brak postów pasujących do filtrów"
              description="Zmień frazę wyszukiwania lub wybierz innego autora."
              action={
                <Button variant="outline" onClick={list.clearFilters}>
                  Wyczyść filtry
                </Button>
              }
              className="border-none"
            />
          ) : (
            <EmptyState
              icon={Calendar}
              title="Nie ma jeszcze żadnych postów"
              description="Dodaj pierwszy post, aby pojawił się na stronie."
              action={addPostButton}
              className="border-none"
            />
          )
        }
      />

      <p className="text-xs text-muted-foreground">
        Wyświetlono {list.visiblePosts.length} z {list.totalCount}{" "}
        {pluralize(list.totalCount, "posta", "postów", "postów")}
      </p>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={
          deleteCount === 1
            ? "Usunąć post?"
            : `Usunąć ${deleteCount} ${pluralize(deleteCount, "post", "posty", "postów")}?`
        }
        description={
          DELETE_AVAILABLE
            ? "Tej operacji nie można cofnąć."
            : "Usuwanie będzie dostępne po podłączeniu panelu do API."
        }
        confirmLabel="Usuń"
        destructive
        confirmDisabled={!DELETE_AVAILABLE}
        onConfirm={() => setPendingDelete(null)}
      />
    </div>
  );
}

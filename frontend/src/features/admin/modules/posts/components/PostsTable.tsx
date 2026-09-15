import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableColumnHeader } from "@/features/admin/components/data-table/SortableColumnHeader";
import { TableEmptyRow } from "@/features/admin/components/data-table/TableEmptyRow";
import type { SortDir } from "@/features/admin/components/data-table/useSortState";
import { ADMIN_PATHS } from "@/features/admin/config/paths";
import { formatDate } from "@/features/admin/lib/format";
import type { PostRow } from "../model/types";
import { PostRowActions } from "./PostRowActions";

const COLUMN_COUNT = 7;

interface PostsTableProps {
  posts: PostRow[];
  selection: {
    isSelected: (id: string) => boolean;
    headerCheckedState: boolean | "indeterminate";
    toggleAll: () => void;
    toggleOne: (id: string) => void;
  };
  sortDir: SortDir;
  onSortToggle: () => void;
  onDelete: (post: PostRow) => void;
  // zawartość wyświetlana, gdy lista jest pusta
  emptyState: ReactNode;
}

export function PostsTable({
  posts,
  selection,
  sortDir,
  onSortToggle,
  onDelete,
  emptyState,
}: PostsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={selection.headerCheckedState}
                onCheckedChange={selection.toggleAll}
                disabled={posts.length === 0}
                aria-label="Zaznacz wszystkie widoczne posty"
              />
            </TableHead>
            <TableHead className="sm:min-w-[240px]">Tytuł</TableHead>
            <TableHead className="max-md:hidden">Autor</TableHead>
            <TableHead className="max-sm:hidden">
              <SortableColumnHeader
                label="Data"
                sortDir={sortDir}
                onToggle={onSortToggle}
              />
            </TableHead>
            <TableHead className="text-center max-lg:hidden">Aktywny</TableHead>
            <TableHead className="text-center max-lg:hidden">
              W aktualnościach
            </TableHead>
            <TableHead className="w-24 text-right">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {posts.length === 0 ? (
            <TableEmptyRow colSpan={COLUMN_COUNT}>{emptyState}</TableEmptyRow>
          ) : (
            posts.map((post) => {
              const selected = selection.isSelected(post.id);
              return (
                <TableRow
                  key={post.id}
                  data-state={selected ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => selection.toggleOne(post.id)}
                      aria-label={`Zaznacz: ${post.title}`}
                    />
                  </TableCell>

                  <TableCell className="max-w-[160px] font-medium sm:max-w-[360px]">
                    <Link
                      to={ADMIN_PATHS.postEdit(post.id)}
                      className="block truncate underline-offset-4 hover:underline focus-visible:underline"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  </TableCell>

                  <TableCell className="max-md:hidden">
                    <Badge variant="secondary">{post.author}</Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground max-sm:hidden">
                    {formatDate(post.date)}
                  </TableCell>

                  {/* przełączniki tylko do odczytu do czasu podpięcia API */}
                  <TableCell className="text-center max-lg:hidden">
                    <Switch
                      checked={post.isActive}
                      disabled
                      aria-label="Post aktywny"
                    />
                  </TableCell>

                  <TableCell className="text-center max-lg:hidden">
                    <Switch
                      checked={post.showInNews}
                      disabled
                      aria-label="Pokazywany w aktualnościach"
                    />
                  </TableCell>

                  <TableCell>
                    <PostRowActions post={post} onDelete={onDelete} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

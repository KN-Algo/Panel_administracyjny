import { Link } from "react-router-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_PATHS, publicPostUrl } from "@/features/admin/config/paths";
import type { PostRow } from "../model/types";

interface PostRowActionsProps {
  post: PostRow;
  onDelete: (post: PostRow) => void;
}

export function PostRowActions({ post, onDelete }: PostRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" asChild>
        <Link
          to={ADMIN_PATHS.postEdit(post.id)}
          title="Edytuj"
          aria-label={`Edytuj: ${post.title}`}
        >
          <Pencil className="size-4" />
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Więcej opcji: ${post.title}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={ADMIN_PATHS.postEdit(post.id)}>
              <Pencil />
              Edytuj
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={publicPostUrl(post.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye />
              Podgląd na stronie
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(post)}
          >
            <Trash2 />
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

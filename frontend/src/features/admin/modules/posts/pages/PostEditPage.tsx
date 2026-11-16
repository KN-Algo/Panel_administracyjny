import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileEdit, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/admin/components/EmptyState";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { ADMIN_PATHS } from "@/features/admin/config/paths";
import { PostForm } from "../components/post-form/PostForm";
import { getMockPostDraft } from "../data/mockPosts";
import type { PostDraft } from "../model/types";

export function PostEditPage() {
  const { id = "" } = useParams();
  const initialValues = useMemo(() => getMockPostDraft(id), [id]);

  if (!initialValues) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Nie znaleziono posta"
        description="Post mógł zostać usunięty albo link jest nieprawidłowy."
        action={
          <Button asChild variant="outline">
            <Link to={ADMIN_PATHS.posts}>
              <ArrowLeft />
              Wróć do listy postów
            </Link>
          </Button>
        }
      />
    );
  }

  // TODO(API): PUT /api/posts/{id}
  const handleSubmit = (draft: PostDraft) => {
    if (import.meta.env.DEV) console.info(`[admin] edycja posta ${id}:`, draft);
  };

  return (
    <>
      <PageHeader
        icon={FileEdit}
        title="Edytuj post"
        description={initialValues.translations.pl.title}
        actions={
          <Button asChild variant="ghost">
            <Link to={ADMIN_PATHS.posts}>
              <ArrowLeft />
              Lista postów
            </Link>
          </Button>
        }
      />
      {/* key = id, żeby przejście na inny post zresetowało stan formularza */}
      <PostForm
        key={id}
        initialValues={initialValues}
        submitLabel="Zapisz zmiany"
        onSubmit={handleSubmit}
      />
    </>
  );
}

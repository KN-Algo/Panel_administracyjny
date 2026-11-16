import { FilePlus } from "lucide-react";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { PostForm } from "../components/post-form/PostForm";
import type { PostDraft } from "../model/types";

export function PostCreatePage() {
  // TODO(API): POST /api/posts
  const handleSubmit = (draft: PostDraft) => {
    if (import.meta.env.DEV) console.info("[admin] nowy post:", draft);
  };

  return (
    <>
      <PageHeader
        icon={FilePlus}
        title="Dodaj post"
        description="Uzupełnij treść w wybranych językach i ustawienia publikacji."
      />
      <PostForm submitLabel="Opublikuj post" onSubmit={handleSubmit} />
    </>
  );
}

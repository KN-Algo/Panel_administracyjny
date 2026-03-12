import { FileEdit } from "lucide-react";

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileEdit className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Edycja treści postów</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Przeglądanie i edycja istniejących postów.
      </p>
    </div>
  );
}

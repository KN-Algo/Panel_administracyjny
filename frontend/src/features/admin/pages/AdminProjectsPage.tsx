import { FolderKanban } from "lucide-react";

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderKanban className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Projekty</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Zarządzanie projektami — edycja, dodawanie i usuwanie.
      </p>
    </div>
  );
}

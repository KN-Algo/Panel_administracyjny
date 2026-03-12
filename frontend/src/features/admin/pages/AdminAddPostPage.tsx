import { FilePlus } from "lucide-react";

export default function AdminAddPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FilePlus className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Dodawanie wpisów</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Tworzenie nowych wpisów i postów.
      </p>
    </div>
  );
}

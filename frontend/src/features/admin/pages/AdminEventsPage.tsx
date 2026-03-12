import { Calendar } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Wydarzenia</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Zarządzanie wydarzeniami — edycja, dodawanie i usuwanie.
      </p>
    </div>
  );
}

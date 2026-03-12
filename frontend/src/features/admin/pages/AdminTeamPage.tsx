import { Users } from "lucide-react";

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Zespół</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Zarządzanie członkami zespołu — edycja, dodawanie i usuwanie.
      </p>
    </div>
  );
}

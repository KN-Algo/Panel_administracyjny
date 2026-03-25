import { UserCog } from "lucide-react";

export default function AdminMemberModalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCog className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Modale członków</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Personalizacja modali wyświetlanych dla członków zespołu.
      </p>
    </div>
  );
}

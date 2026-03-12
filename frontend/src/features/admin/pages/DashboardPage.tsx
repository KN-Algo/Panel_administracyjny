export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Witaj w panelu administracyjnym. Tutaj będą statystyki i zarządzanie
          treścią.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium">Użytkownicy</h3>
          <p className="mt-2 text-2xl font-bold">22</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium">Projekty</h3>
          <p className="mt-2 text-2xl font-bold">48</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium">Wydarzenia</h3>
          <p className="mt-2 text-2xl font-bold">32</p>
        </div>
      </div>
    </div>
  );
}

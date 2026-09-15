import { Link } from "react-router-dom";
import {
  Calendar,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import eventsData from "@/data/events_pl.json";
import projectsData from "@/data/projects_pl.json";
import teamData from "@/data/team.json";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { StatCard } from "@/features/admin/components/StatCard";
import { ADMIN_PATHS } from "@/features/admin/config/paths";

// liczby z danych strony - po podpięciu API do podmiany na odpowiedzi z backendu
const STATS = [
  {
    label: "Posty",
    value: eventsData.length,
    icon: Calendar,
    to: ADMIN_PATHS.posts,
  },
  {
    label: "Projekty",
    value: projectsData.length,
    icon: FolderKanban,
    to: ADMIN_PATHS.projects,
  },
  {
    label: "Członkowie zespołu",
    value: teamData.length,
    icon: Users,
    to: ADMIN_PATHS.team,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Witaj w panelu administracyjnym. Wybierz sekcję lub skorzystaj z szybkich akcji."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Szybkie akcje
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to={ADMIN_PATHS.postNew}>
              <Plus />
              Dodaj post
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ADMIN_PATHS.posts}>
              <Calendar />
              Przejdź do postów
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

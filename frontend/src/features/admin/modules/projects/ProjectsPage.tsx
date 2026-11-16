import { FolderKanban } from "lucide-react";
import { ComingSoonPage } from "@/features/admin/components/ComingSoonPage";

export function ProjectsPage() {
  return (
    <ComingSoonPage
      icon={FolderKanban}
      title="Projekty"
      description="Zarządzanie projektami — edycja, dodawanie i usuwanie."
    />
  );
}

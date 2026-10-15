import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";

interface ComingSoonPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// wspólny szablon sekcji, które nie mają jeszcze funkcjonalności
export function ComingSoonPage({
  icon,
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <>
      <PageHeader icon={icon} title={title} description={description} />
      <EmptyState
        icon={Construction}
        title="Sekcja w przygotowaniu"
        description="Ta część panelu jest jeszcze w budowie. Wkrótce pojawią się tu narzędzia do zarządzania treścią."
      />
    </>
  );
}

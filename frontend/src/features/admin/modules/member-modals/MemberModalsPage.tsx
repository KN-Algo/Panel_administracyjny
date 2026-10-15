import { UserCog } from "lucide-react";
import { ComingSoonPage } from "@/features/admin/components/ComingSoonPage";

export function MemberModalsPage() {
  return (
    <ComingSoonPage
      icon={UserCog}
      title="Modale członków"
      description="Personalizacja modali wyświetlanych dla członków zespołu."
    />
  );
}

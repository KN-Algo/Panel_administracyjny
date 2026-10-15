import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/features/admin/components/ui/sidebar";
import { useAdminAuth } from "@/features/admin/auth/useAdminAuth";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";

export function AdminHeader() {
  const { logout } = useAdminAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 sm:gap-4">
      <SidebarTrigger
        variant="outline"
        className="max-md:scale-125"
        aria-label="Pokaż lub ukryj menu"
      />
      <Separator orientation="vertical" className="h-6!" />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <AdminBreadcrumbs />
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Otwórz stronę w nowej karcie"
            >
              <ExternalLink />
              <span className="max-sm:sr-only">Zobacz stronę</span>
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut />
            <span className="max-sm:sr-only">Wyloguj</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

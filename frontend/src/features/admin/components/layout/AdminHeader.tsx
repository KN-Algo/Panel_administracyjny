import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type AdminHeaderProps = {
  onLogout: () => void;
};

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b bg-background px-4 sm:gap-4">
      <SidebarTrigger variant="outline" className="max-md:scale-125" />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold">Panel Administracyjny</h1>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          <span className="max-sm:sr-only">Wyloguj</span>
        </Button>
      </div>
    </header>
  );
}

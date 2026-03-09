import { useNavigate, Outlet } from "react-router-dom";
import { LayoutProvider } from "@/context/LayoutProvider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("panel-auth");
    navigate("/panel");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <LayoutProvider>
        <SidebarProvider defaultOpen={true}>
          <AdminSidebar />
          <SidebarInset className="h-svh @container/content">
            <AdminHeader onLogout={handleLogout} />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </TooltipProvider>
  );
}

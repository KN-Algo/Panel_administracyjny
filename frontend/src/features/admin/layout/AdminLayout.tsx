import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageFallback } from "@/features/admin/components/PageFallback";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen className="h-svh overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="@container/content h-svh min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 [scrollbar-gutter:stable] md:p-6">
            <div className="mx-auto w-full max-w-6xl">
              <Suspense fallback={<PageFallback />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

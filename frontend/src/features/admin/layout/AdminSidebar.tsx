import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/features/admin/components/ui/sidebar";
import {
  NAV_GROUPS,
  isNavItemActive,
} from "@/features/admin/config/navigation";
import { ADMIN_PATHS } from "@/features/admin/config/paths";

export function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-16 justify-center border-b px-3 py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="h-8!">
              <Link
                to={ADMIN_PATHS.dashboard}
                className="flex items-center gap-2"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none whitespace-nowrap">
                  <span className="font-semibold">Admin Panel</span>
                  <span className="text-xs text-muted-foreground">
                    Zarządzanie
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = isNavItemActive(item, pathname);
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link
                          to={item.to}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <p className="text-xs whitespace-nowrap text-muted-foreground group-data-[collapsible=icon]:hidden">
          Panel v1.0.0
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

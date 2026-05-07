import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Users,
  FileEdit,
  FilePlus,
  UserCog,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b px-3 h-16 justify-center py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="h-8!">
              <Link to="/panel/admin" className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="h-4 w-4" />
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
        <SidebarGroup>
          <SidebarGroupLabel>Główne</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/panel/admin"}
                >
                  <Link to="/panel/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Treść strony</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/panel/admin/projects"}
                >
                  <Link to="/panel/admin/projects">
                    <FolderKanban />
                    <span>Projekty</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/panel/admin/posts"}
                >
                  <Link to="/panel/admin/posts">
                    <Calendar />
                    <span>Posty</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/panel/admin/team"}
                >
                  <Link to="/panel/admin/team">
                    <Users />
                    <span>Zespół</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Posty i wpisy</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/panel/admin/add-post"}
                >
                  <Link to="/panel/admin/add-post">
                    <FilePlus />
                    <span>Dodaj post</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/panel/admin/edit-post"}
                >
                  <Link to="/panel/admin/edit-post">
                    <FileEdit />
                    <span>Edytuj treść posta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Personalizacja</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/panel/admin/member-modals"}
                >
                  <Link to="/panel/admin/member-modals">
                    <UserCog />
                    <span>Modale członków</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <p className="text-xs text-muted-foreground">Panel v1.0.0</p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  Eclipse,
  Gauge,
  Gavel,
  LayoutList,
  Users
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const data = {
  navMain: [
    {
      title: "Dashboard",
      icon: Gauge,
      href: "/dashboard",
    },
    {
      title: "Modalidades",
      icon: LayoutList,
      href: "/categories",
    },
    {
      title: "Inscrições",
      icon: Users,
      href: "/registrations",
    },
    {
      title: "Juiz",
      icon: Gavel,
      href: "/registrations",
    },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Eclipse className="size-5!" />
              <span className="text-base font-semibold">Rodeo Digital</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item, index) => (
                <SidebarMenuItem key={`${item.title}-${index}`}>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith(item.href)}
                    tooltip={item.title}
                    onClick={() => navigate(item.href)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

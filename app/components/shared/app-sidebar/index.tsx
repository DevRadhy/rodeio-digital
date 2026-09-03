import { Gavel, LayoutList, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import LacoLogo from "/laco-logo.svg";

const data = {
  navMain: [
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
      href: "/competition",
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
              <img
                src={LacoLogo}
                alt="Rodeo Digital"
                className="size-6 brightness-0 invert"
              />
              <span className="font-display text-2xl font-extrabold uppercase">
                Rodeo Digital
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={`${item.title}-${item.href}`}>
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

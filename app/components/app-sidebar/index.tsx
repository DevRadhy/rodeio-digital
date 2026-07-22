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
} from "@/components/ui/sidebar";
import {
  ChartNoAxesCombined,
  SquareStack,
  Users
} from "lucide-react";
import { NavLink } from "react-router";

const data = [
  {
    title: "Modalidades",
    icon: SquareStack,
    href: "/categories",
  },
  {
    title: "Inscrições",
    icon: Users,
    href: "/subscribes",
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex gap-2 items-center">
          <ChartNoAxesCombined className="text-slate-500" />
          <span className="overflow-hidden">Rodeo Digital</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Cadastro</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item, index) => (
                <SidebarMenuItem key={`${item.title}-${index}`}>
                  <NavLink to={item.href}>
                    <SidebarMenuButton>
                      {<item.icon />}
                      {item.title}
                    </SidebarMenuButton>
                  </NavLink>
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

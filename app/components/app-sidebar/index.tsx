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
  BookPlus,
  ClipboardList,
  Plus,
  SquareStack,
  Users,
} from "lucide-react";
import Boots from "../../../public/rodeo.png";
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
        <img src={Boots} alt="Rodeo boots" className="max-w-12 resize" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Cadastro</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item) => (
                <SidebarMenuItem>
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

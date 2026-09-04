import {
  CalendarDays,
  Check,
  ChevronsUpDown,
  Gavel,
  LayoutList,
  LogOut,
  Monitor,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/auth-context";
import LacoLogo from "/laco-logo.svg";

const navigation = [
  { title: "Modalidades", icon: LayoutList, href: "/categories" },
  { title: "Inscrições", icon: Users, href: "/registrations" },
  { title: "Juiz", icon: Gavel, href: "/competition" },
  { title: "Telões", icon: Monitor, href: "/displays" },
  { title: "Equipe e acessos", icon: ShieldCheck, href: "/event-access" },
];

const roleLabels = {
  ORGANIZATION_ADMIN: "Administrador da organização",
  REGISTRATION_MANAGER: "Secretaria",
  JUDGE: "Juiz",
  ANNOUNCER: "Narrador",
  DISPLAY_GATE: "Telão da saída",
  DISPLAY_SCOREBOARD: "Telão da arquibancada",
} as const;

function eventHome(role: keyof typeof roleLabels) {
  if (role === "ORGANIZATION_ADMIN") return "/categories";
  if (role === "REGISTRATION_MANAGER") return "/registrations";
  return "/competition";
}

function EventSwitcher() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  function selectEvent(eventId: string, role: keyof typeof roleLabels) {
    auth.selectEvent(eventId);
    navigate(eventHome(role));
    setOpenMobile(false);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {auth.event?.name ?? "Selecionar evento"}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/65">
                {auth.event
                  ? auth.user?.globalRole === "PLATFORM_OPERATOR"
                    ? "Administrador do evento"
                    : roleLabels[auth.event.role]
                  : "Nenhum evento ativo"}
              </span>
            </span>
            <ChevronsUpDown className="ml-auto size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-64 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Eventos disponíveis</DropdownMenuLabel>
              {auth.events.map((event) => (
                <DropdownMenuItem
                  key={event.id}
                  onClick={() => selectEvent(event.id, event.role)}
                  className="gap-3 p-2"
                >
                  <span className="flex size-7 items-center justify-center rounded-md border bg-background">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="grid min-w-0 flex-1">
                    <span className="truncate font-medium">{event.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {roleLabels[event.role]}
                    </span>
                  </span>
                  {event.id === auth.event?.id && (
                    <Check className="size-4 text-primary" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/events")}>
                <LayoutList aria-hidden="true" />
                Ver todos os eventos
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserMenu() {
  const auth = useAuth();
  const { isMobile } = useSidebar();
  const initials = auth.user?.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const avatar = (
    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
      {initials || "U"}
    </span>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            {avatar}
            <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{auth.user?.name}</span>
              <span className="truncate text-xs text-sidebar-foreground/65">
                {auth.user?.email}
              </span>
            </span>
            <ChevronsUpDown className="ml-auto size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-64 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2 font-normal">
                <span className="flex items-center gap-2">
                  {avatar}
                  <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-foreground">
                      {auth.user?.name}
                    </span>
                    <span className="truncate text-xs">{auth.user?.email}</span>
                  </span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => void auth.logout()}
              >
                <LogOut aria-hidden="true" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, user } = useAuth();
  const { setOpenMobile } = useSidebar();
  const items = navigation.filter(
    (item) =>
      user?.globalRole === "PLATFORM_OPERATOR" ||
      user?.globalRole === "PLATFORM_ADMIN" ||
      event?.role === "ORGANIZATION_ADMIN" ||
      (event?.role === "REGISTRATION_MANAGER" &&
        item.href !== "/categories" &&
        item.href !== "/displays" &&
        item.href !== "/event-access") ||
      (["JUDGE", "ANNOUNCER", "DISPLAY_GATE", "DISPLAY_SCOREBOARD"].includes(
        event?.role ?? "",
      ) &&
        item.href === "/competition"),
  );

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:hidden">
          <img src={LacoLogo} alt="" className="size-5 brightness-0 invert" />
          <span className="font-display text-sm font-bold uppercase tracking-wide">
            Rodeo Digital
          </span>
        </div>
        <EventSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith(item.href)}
                    tooltip={item.title}
                    onClick={() => {
                      navigate(item.href);
                      setOpenMobile(false);
                    }}
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

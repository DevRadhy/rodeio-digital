import { LockKeyhole } from "lucide-react";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/auth-context";

export default function PageLayout() {
  const { event } = useAuth();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <div className="w-full bg-background">
        <SiteHeader />
        {event?.accessMode === "read_only" && (
          <div
            className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-800 dark:text-amber-300"
            role="status"
          >
            <LockKeyhole className="size-4" aria-hidden="true" />
            Evento somente leitura. Os dados continuam disponíveis para
            consulta.
          </div>
        )}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

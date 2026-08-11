import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <div className="w-full">
          <SiteHeader />
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}

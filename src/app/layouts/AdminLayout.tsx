import { Outlet } from "react-router";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigationStore } from "@/stores/navigationStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { CONTENT_MAX_WIDTH } from "@/lib/constants";

/**
 * Admin panel layout — darker sidebar, no AI assistant corner.
 */
export function AdminLayout() {
  const { sidebarOpen, setSidebarOpen } = useNavigationStore();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isMobile && (
        <AdminSidebar className="hidden md:flex flex-col shrink-0" />
      )}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
            <AdminSidebar className="flex flex-col h-full w-full" />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto">
          <div
            className="px-4 py-6 md:px-6 mx-auto"
            style={{ maxWidth: CONTENT_MAX_WIDTH }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

import { Outlet, NavLink, useLocation } from "react-router";
import { Users } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigationStore } from "@/stores/navigationStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CONTENT_MAX_WIDTH } from "@/lib/constants";

/**
 * Doctor view layout — simplified sidebar with patient navigation only.
 * Doctors have read-only access to shared patient data.
 * Supports mobile sidebar via Sheet overlay.
 */
export function DoctorLayout() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useNavigationStore();
  const isMobile = useIsMobile();

  const DoctorSidebarContent = () => (
    <aside className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-full">
      <div className="px-4 py-5">
        <Logo size="md" />
      </div>
      <Separator />
      <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider font-medium mt-2">
        Doctor View
      </div>
      <nav className="px-2 space-y-1">
        <NavLink
          to={ROUTES.DOCTOR_PATIENTS}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            location.pathname.startsWith("/doctor/patients")
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
          onClick={() => setSidebarOpen(false)}
        >
          <Users size={18} />
          <span>My Patients</span>
        </NavLink>
      </nav>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="hidden md:flex flex-col w-64 shrink-0">
          <DoctorSidebarContent />
        </div>
      )}

      {/* Mobile sidebar sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SheetTitle className="sr-only">Doctor Navigation</SheetTitle>
            <DoctorSidebarContent />
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

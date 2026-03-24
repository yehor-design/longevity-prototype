import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  ShoppingBag,
  Video,
  User,
  Coins,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { useNavigationStore } from "@/stores/navigationStore";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PatientUser } from "@/types";

interface NavItemDef {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

const NAV_ITEMS: NavItemDef[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Questionnaire", href: ROUTES.QUESTIONNAIRE, icon: ClipboardList, badge: "15%" },
  { label: "My Tests", href: ROUTES.TESTS, icon: FileText },
  { label: "Marketplace", href: ROUTES.MARKETPLACE, icon: ShoppingBag },
  { label: "Consultations", href: ROUTES.CONSULTATIONS, icon: Video },
  { label: "Profile", href: ROUTES.PROFILE, icon: User },
];

/**
 * Collapsible sidebar for authenticated patient pages.
 * Renders as a sheet overlay on mobile (controlled by parent).
 */
export function AppSidebar({ className }: { className?: string }) {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useNavigationStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const patient = user?.role === "patient" ? (user as PatientUser) : null;

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-70",
        className
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center px-4 py-5 shrink-0", sidebarCollapsed && "justify-center px-0")}>
        {sidebarCollapsed ? (
          <Logo size="sm" className="justify-center" />
        ) : (
          <Logo size="md" />
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(item.href + "/");

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <Badge variant="secondary" className="text-xs h-5 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <Separator />

      {/* Token wallet */}
      <div
        className={cn(
          "px-4 py-3 flex items-center gap-3",
          sidebarCollapsed && "justify-center px-0"
        )}
      >
        <Coins size={18} className="text-amber-500 shrink-0" />
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Token Balance</div>
            <div className="font-semibold text-sm">
              {patient?.tokenBalance ?? 0} tokens
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebarCollapsed}
        className="flex items-center justify-center py-3 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : (
          <span className="flex items-center gap-2 text-xs px-4">
            <ChevronLeft size={16} />
            Collapse
          </span>
        )}
      </button>
    </aside>
  );
}

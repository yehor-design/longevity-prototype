import { NavLink, useLocation } from "react-router";
import {
  Users,
  ClipboardList,
  ShoppingBag,
  Video,
  Coins,
  Package,
  ScrollText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

interface NavItemDef {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const ADMIN_NAV_ITEMS: NavItemDef[] = [
  { label: "Users", href: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Questionnaire Builder", href: ROUTES.ADMIN_QUESTIONNAIRES, icon: ClipboardList },
  { label: "Marketplace", href: ROUTES.ADMIN_MARKETPLACE, icon: ShoppingBag },
  { label: "Consultations", href: ROUTES.ADMIN_CONSULTATIONS, icon: Video },
  { label: "Token Config", href: ROUTES.ADMIN_TOKENS, icon: Coins },
  { label: "Orders", href: ROUTES.ADMIN_ORDERS, icon: Package },
  { label: "Audit Logs", href: ROUTES.ADMIN_AUDIT, icon: ScrollText },
  { label: "My Profile", href: ROUTES.ADMIN_PROFILE, icon: User },
];

/**
 * Sidebar navigation for the Admin panel. Uses a darker scheme
 * distinct from the patient sidebar.
 */
export function AdminSidebar({ className }: { className?: string }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-70 bg-zinc-900 dark:bg-zinc-950 border-r border-zinc-800 text-zinc-100",
        className
      )}
    >
      <div className="px-4 py-5">
        <Logo size="md" variant="admin" />
      </div>

      <Separator className="bg-zinc-800" />

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(item.href + "/");

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-600/80 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

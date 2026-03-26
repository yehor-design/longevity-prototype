import {
  Bell,
  Moon,
  Sun,
  LogOut,
  UserCircle,
  Settings,
  ClipboardList,
  ShoppingBag,
  Video,
  Coins,
  Menu,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { ROUTES } from "@/lib/constants";
import { getDisplayName } from "@/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface NavItem {
  label: string;
  href: string;
}

const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD },
  { label: "Health Plan", href: ROUTES.QUESTIONNAIRE },
  { label: "My Tests", href: ROUTES.TESTS },
];

interface SecondaryNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const SECONDARY_NAV: SecondaryNavItem[] = [
  { label: "Questionnaire", href: ROUTES.QUESTIONNAIRE, icon: ClipboardList },
  { label: "Marketplace", href: ROUTES.MARKETPLACE, icon: ShoppingBag },
  { label: "Consultations", href: ROUTES.CONSULTATIONS, icon: Video },
  { label: "Token Wallet", href: ROUTES.TOKENS, icon: Coins },
];

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { sidebarOpen, setSidebarOpen } = useNavigationStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  const handleLogout = () => {
    logout();
    navigate(ROUTES.WELCOME);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-[62px] items-center border-b border-black/8 bg-white dark:bg-background px-6",
          className
        )}
      >
        {/* Mobile hamburger */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0 mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </Button>
        )}

        {/* Logo */}
        <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-2 shrink-0">
          <img src="/Logo.png" alt="Longevity" className="h-8 w-auto" />
        </NavLink>

        {/* Center nav (desktop) */}
        <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-black/4 text-foreground dark:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/4 dark:hover:bg-white/10"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="size-8 rounded-lg"
          >
            {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="size-8 rounded-lg"
          >
            <Bell size={16} />
          </Button>

          {/* Bio Age (desktop) */}
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-xs font-medium text-foreground leading-3">Bio Age: 32</span>
            <span className="text-[10px] font-medium text-emerald-600 leading-3">-4 yrs</span>
          </div>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative size-8 rounded-lg p-0"
                aria-label="User menu"
              >
                <Avatar className="size-8 rounded-lg border-2 border-black/8">
                  <AvatarFallback className="text-[10px] font-medium bg-primary text-primary-foreground rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user ? getDisplayName(user) : "Guest"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile-only: primary nav items */}
              {isMobile &&
                PRIMARY_NAV.map((item) => (
                  <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
              {isMobile && <DropdownMenuSeparator />}

              {/* Secondary nav items */}
              {SECONDARY_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                <UserCircle className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE_EDIT)}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile nav sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-4 w-[280px]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col gap-1 mt-4">
              {PRIMARY_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {SECONDARY_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

import { Menu, Bell, Sun, Moon, LogOut, UserCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router";
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
import { useAuthStore } from "@/stores/authStore";
import { useNavigationStore } from "@/stores/navigationStore";
import { useThemeStore } from "@/stores/themeStore";
import { ROUTES } from "@/lib/constants";
import { getDisplayName } from "@/types";
import { cn } from "@/lib/utils";

interface TopBarProps {
  showHamburger?: boolean;
  className?: string;
}

/**
 * Sticky top navigation bar with page title, notifications, and user menu.
 */
export function TopBar({ showHamburger = false, className }: TopBarProps) {
  const { user, logout } = useAuthStore();
  const { pageTitle, toggleSidebar } = useNavigationStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  const handleLogout = () => {
    logout();
    navigate(ROUTES.WELCOME);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 md:px-6",
        className
      )}
    >
      {/* Hamburger (mobile) */}
      {showHamburger && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </Button>
      )}

      {/* Page title */}
      <h2 className="font-semibold text-sm md:text-base flex-1 truncate">{pageTitle}</h2>

      {/* Right actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={16} />
        </Button>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
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
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
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
  );
}

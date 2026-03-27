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
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useQuestionnaireProgressStore } from "@/features/questionnaire/stores/questionnaireProgressStore";
import { AvatarProgressCard } from "@/features/questionnaire/components/QuestionnaireProgressWidget";
import { ROUTES } from "@/lib/constants";
import { getDisplayName } from "@/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMediaQuery";

// ─── Nav config ───────────────────────────────────────────────────────────────

const PRIMARY_NAV = [
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
  // "Questionnaire" removed — the AvatarProgressCard in the dropdown serves this role
  { label: "Marketplace", href: ROUTES.MARKETPLACE, icon: ShoppingBag },
  { label: "Consultations", href: ROUTES.CONSULTATIONS, icon: Video },
  { label: "Token Wallet", href: ROUTES.TOKENS, icon: Coins },
];

// ─── TopBar ───────────────────────────────────────────────────────────────────

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { sidebarOpen, setSidebarOpen } = useNavigationStore();
  const { progressPercentage, lastSavedDate, statusLabel, userAvatarUrl } =
    useQuestionnaireProgressStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";
  const userName = user?.firstName || (user ? getDisplayName(user) : "My Health");

  const handleLogout = () => {
    logout();
    navigate(ROUTES.WELCOME);
  };

  const handleNavigateToQuestionnaire = () => navigate(ROUTES.QUESTIONNAIRE);

  // Dropdown item click: block Radix, close menu, then navigate
  const handleDropdownCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setUserMenuOpen(false);
    setTimeout(handleNavigateToQuestionnaire, 80);
  };

  const sharedCardProps = {
    initials,
    progressPercentage,
    statusLabel,
    userName,
    userAvatarUrl,
    lastSavedDate,
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
        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications" className="size-8 rounded-lg">
            <Bell size={16} />
          </Button>

          {/* Token Wallet pill */}
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.TOKENS)}
            aria-label="Token Wallet"
            className={cn(
              "hidden sm:flex items-center gap-1 h-6 rounded-full !px-1.5",
              "border border-border/50 bg-muted/40",
              "hover:bg-muted hover:border-border",
              "text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
            )}
          >
            <Coins size={11} className="text-muted-foreground shrink-0" />
            <span className="tabular-nums">1&thinsp;250</span>
          </Button>

          {/* ── Zone A: AvatarProgressCard as DropdownMenuTrigger ── */}
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <span
                role="button"
                tabIndex={0}
                aria-label="Open user menu"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setUserMenuOpen(true);
                }}
              >
                {/* variant="trigger" — pill shape */}
                <AvatarProgressCard {...sharedCardProps} variant="trigger" />
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">

              {/* User identity */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  {/* Plain round avatar — no progress ring */}
                  <Avatar className="size-9 rounded-full shrink-0">
                    {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt="Profile" />}
                    <AvatarFallback className="rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                      {user ? getDisplayName(user) : "Guest"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* ── Zone B: AvatarProgressCard (menu variant) — navigates on click ── */}
              <div className="px-1 pt-0.5 pb-1">
                <button
                  className="group w-full text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={handleDropdownCardClick}
                  aria-label="Open health questionnaire"
                >
                  <AvatarProgressCard {...sharedCardProps} variant="menu" />
                </button>
              </div>
              <DropdownMenuSeparator />

              {/* Mobile-only: primary nav */}
              {isMobile && PRIMARY_NAV.map((item) => (
                <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
              {isMobile && <DropdownMenuSeparator />}

              {/* Secondary nav */}
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

              {/* Theme toggle — onSelect prevented to keep menu open */}
              <DropdownMenuItem
                className="flex items-center justify-between cursor-default focus:bg-accent"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-2">
                  {resolvedTheme === "dark"
                    ? <Moon size={14} className="text-muted-foreground" />
                    : <Sun size={14} className="text-muted-foreground" />}
                  <span>Dark mode</span>
                </div>
                <Switch
                  checked={resolvedTheme === "dark"}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="ml-auto scale-90"
                />
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
                      isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
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
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
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

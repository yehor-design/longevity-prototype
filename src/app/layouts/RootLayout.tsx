import { useEffect } from "react";
import { Outlet } from "react-router";
import { Providers } from "@/app/providers";
import { PrototypeFab } from "@/components/common/PrototypeFab";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { useThemeStore } from "@/stores/themeStore";

/**
 * Root layout — the outermost shell wrapping every route.
 *
 * Responsibilities:
 * - Initialises the theme (applies dark/light class to <html>)
 * - Mounts global UI: Toaster, PrototypeFab
 * - Wraps all children with required context providers
 */
export function RootLayout() {
  const { theme, resolvedTheme } = useThemeStore();

  // Keep <html> class in sync with the resolved theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme, theme]);

  return (
    <Providers>
      <Outlet />
      <ToastProvider />
      <PrototypeFab />
    </Providers>
  );
}

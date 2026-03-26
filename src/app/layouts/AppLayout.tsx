import { Outlet } from "react-router";
import { TopBar } from "@/components/navigation/TopBar";
import { HealthAssistantPanel } from "@/features/dashboard";

/**
 * Authenticated patient layout:
 * - Top navbar with centered navigation
 * - Main content area (fluid)
 * - Health Assistant panel always open on the right
 */
export function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopBar />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto min-w-0 scrollbar-hidden">
          <Outlet />
        </main>

        {/* Health Assistant — always visible on desktop */}
        <aside className="hidden lg:flex w-[340px] shrink-0">
          <HealthAssistantPanel />
        </aside>
      </div>
    </div>
  );
}

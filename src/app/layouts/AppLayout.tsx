import { Outlet } from "react-router";
import { MessageCircle, X } from "lucide-react";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigationStore } from "@/stores/navigationStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { CONTENT_MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Authenticated patient layout with collapsible sidebar, top bar,
 * breadcrumbs, main content area, and AI assistant FAB.
 */
export function AppLayout() {
  const { sidebarOpen, setSidebarOpen, aiPanelOpen, toggleAiPanel } =
    useNavigationStore();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <AppSidebar className="hidden md:flex flex-col shrink-0" />
      )}

      {/* Mobile sidebar sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar className="flex flex-col h-full w-full" />
          </SheetContent>
        </Sheet>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar showHamburger={isMobile} />
        <Breadcrumbs />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div
            className="px-4 py-6 md:px-6 mx-auto"
            style={{ maxWidth: CONTENT_MAX_WIDTH }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Assistant panel */}
      <div
        className={cn(
          "fixed bottom-0 right-0 h-full z-40 transition-all duration-300 ease-in-out flex flex-col",
          aiPanelOpen
            ? "w-full md:w-[400px] border-l bg-background shadow-2xl"
            : "w-0 overflow-hidden"
        )}
      >
        {aiPanelOpen && (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold">AI Health Assistant</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAiPanel}
                aria-label="Close AI assistant"
              >
                <X size={18} />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <p className="text-muted-foreground text-sm">
                AI Assistant will be implemented in the Dashboard flow.
              </p>
            </div>
          </>
        )}
      </div>

      {/* AI FAB */}
      <button
        onClick={toggleAiPanel}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-13 w-13 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center transition-all duration-200 hover:scale-105",
          aiPanelOpen && "md:right-[416px]"
        )}
        aria-label="Open AI assistant"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { BreadcrumbItem } from "@/types";

interface NavigationState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  pageTitle: string;
  breadcrumbs: BreadcrumbItem[];
  aiPanelOpen: boolean;

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (crumbs: BreadcrumbItem[]) => void;
  setAiPanelOpen: (open: boolean) => void;
  toggleAiPanel: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      sidebarCollapsed: false,
      pageTitle: "Dashboard",
      breadcrumbs: [],
      aiPanelOpen: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }, false, "nav/setSidebarOpen"),
      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen }), false, "nav/toggleSidebar"),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }, false, "nav/setSidebarCollapsed"),
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }), false, "nav/toggleCollapsed"),
      setPageTitle: (title) => set({ pageTitle: title }, false, "nav/setPageTitle"),
      setBreadcrumbs: (breadcrumbs) =>
        set({ breadcrumbs }, false, "nav/setBreadcrumbs"),
      setAiPanelOpen: (open) => set({ aiPanelOpen: open }, false, "nav/setAiPanel"),
      toggleAiPanel: () =>
        set((s) => ({ aiPanelOpen: !s.aiPanelOpen }), false, "nav/toggleAiPanel"),
    }),
    { name: "NavigationStore" }
  )
);

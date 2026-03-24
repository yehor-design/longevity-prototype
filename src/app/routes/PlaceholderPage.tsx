import { useEffect } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import { Badge } from "@/components/ui/badge";
import type { BreadcrumbItem } from "@/types";

interface PlaceholderPageProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Generic placeholder rendered for all routes not yet built.
 * Displays the route name and a "Coming soon" indicator.
 * Sets page title and optional breadcrumbs via navigation store.
 */
export function PlaceholderPage({ title, breadcrumbs }: PlaceholderPageProps) {
  const setPageTitle = useNavigationStore((s) => s.setPageTitle);
  const setBreadcrumbs = useNavigationStore((s) => s.setBreadcrumbs);

  useEffect(() => {
    document.title = `${title} — DT Health`;
    setPageTitle(title);
    setBreadcrumbs(breadcrumbs ?? [{ label: "Home" }, { label: title }]);
  }, [title, breadcrumbs, setPageTitle, setBreadcrumbs]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-2xl">
        🚧
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-xl font-semibold">{title}</h1>
          <Badge variant="secondary">Coming soon</Badge>
        </div>
        <p className="text-muted-foreground text-sm max-w-sm">
          This page will be built in a future iteration. All routes are wired
          and ready for implementation.
        </p>
      </div>
    </div>
  );
}

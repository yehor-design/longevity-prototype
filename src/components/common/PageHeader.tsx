import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import type { BreadcrumbItem } from "@/types";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

/**
 * Consistent page-level header with title, optional subtitle,
 * and an actions slot for buttons/controls.
 * When `breadcrumbs` is provided, syncs them to the navigation store.
 */
export function PageHeader({ title, subtitle, actions, breadcrumbs, className }: PageHeaderProps) {
  const setBreadcrumbs = useNavigationStore((s) => s.setBreadcrumbs);
  const setPageTitle = useNavigationStore((s) => s.setPageTitle);

  useEffect(() => {
    setPageTitle(title);
    if (breadcrumbs) setBreadcrumbs(breadcrumbs);
  }, [title, breadcrumbs, setPageTitle, setBreadcrumbs]);

  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

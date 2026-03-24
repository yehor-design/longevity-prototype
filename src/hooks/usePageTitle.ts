import { useEffect } from "react";
import { useNavigationStore } from "@/stores";

/**
 * Sets the document title and the navigation store's page title simultaneously.
 * Call at the top of each page component.
 */
export function usePageTitle(title: string, breadcrumbs?: import("@/types").BreadcrumbItem[]) {
  const setPageTitle = useNavigationStore((s) => s.setPageTitle);
  const setBreadcrumbs = useNavigationStore((s) => s.setBreadcrumbs);

  useEffect(() => {
    document.title = `${title} — DT Health`;
    setPageTitle(title);
    if (breadcrumbs) setBreadcrumbs(breadcrumbs);
  }, [title, breadcrumbs, setPageTitle, setBreadcrumbs]);
}

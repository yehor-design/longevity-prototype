import type { UserRole } from "./user";

/** Single navigation item (may have children) */
export interface NavItem {
  label: string;
  href: string;
  /** Lucide icon component name */
  icon: string;
  badge?: string | number;
  children?: NavItem[];
  requiredRole?: UserRole[];
}

/** Breadcrumb trail item */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

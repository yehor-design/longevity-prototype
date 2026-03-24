import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import { ROLE_HOME, ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";

interface PrototypeAuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

/**
 * Prototype route guard.
 * - If not authenticated → redirect to /welcome
 * - If wrong role → redirect to that role's home page
 * - Otherwise → render children
 *
 * In prototype mode this always passes if a mock session exists.
 */
export function PrototypeAuthGuard({ children, requiredRole }: PrototypeAuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.WELCOME} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }

  return <>{children}</>;
}

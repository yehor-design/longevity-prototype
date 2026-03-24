import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global providers wrapper. Composes all context providers needed by the app.
 * Add new providers here as they are introduced in future flows.
 *
 * Currently provides:
 * - TooltipProvider (shadcn/ui requirement for Tooltip components)
 */
export function Providers({ children }: ProvidersProps) {
  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
}
